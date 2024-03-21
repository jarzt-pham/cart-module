import { Inject, Nullable, Optional, Repository, Scope } from '@heronjs/common';
import { DAOTokens, MapperTokens, RepoTokens } from '../../../../constants';
import { ICartMapper } from '../utils/objects';
import { ICartAttributeDAO, ICartAttributeValueDAO, ICartDAO, ICartItemDAO } from '../../infra/databases';
import {
    Cart,
    CartCreateInput,
    CartItem,
    CartItemCreateInput,
    CartItemUpdateInput,
    CartUpdateInput,
} from '../aggregates';
import { CartDTO, CartItemDTO } from '../dtos';
import { CartNotBelongToUserError, CartNotFoundError } from '../errors';
import {
    EavEntityChangeAttributesValuesOutput,
    EavEntityRepo,
    EavMapperTokens,
    EavUtil,
    IEavAttributeMapper,
    IEavAttributeValueMapper,
    IEavEntityRepo,
} from '@cbidigital/aqua';
import { ICartItemMapper } from '../utils/objects/mappers/cart-item.mapper';
import { ResolveOption } from '@cbidigital/aqua/database/query-util';
import { CartItemNotFoundError } from '../errors/cart-item';

export interface ICartRepo extends IEavEntityRepo {
    create: (input: CartCreateInput) => Promise<Cart>;
    update: (id: string, input: CartUpdateInput) => Promise<Cart>;
    delete: (id: string, userId: string, cart?: Cart, isCreator?: boolean) => Promise<string>;
    getById: (
        id: string,
        userId: string,
        includeItems?: boolean,
        includeAttr?: boolean,
        isCreator?: boolean,
    ) => Promise<Optional<Cart>>;
    getActiveForUser: (
        userId: string,
        targetId: Nullable<string>,
        includeItems?: boolean,
        includeAttr?: boolean,
    ) => Promise<Optional<Cart>>;

    createItem: (input: CartItemCreateInput) => Promise<CartItem>;
    deleteItem: (itemId: string, item?: CartItem) => Promise<string>;
    deleteListItemByListId: (listId: string[]) => Promise<string[]>;
    getItemByProductId: (
        cartId: string,
        productId: string,
        throwErr?: boolean,
    ) => Promise<Optional<CartItem>>;
    getItemById: (itemId: string, throwErr?: boolean) => Promise<CartItem>;
    getListItemByListId: (listId: string[], throwErr?: boolean) => Promise<CartItemDTO[]>;
    getAllItem: (userId: string, isCreator?: boolean) => Promise<CartItemDTO[]>;
    updateItem: (item: CartItem, input: CartItemUpdateInput) => Promise<CartItem>;
    upsertListItem: (input: CartItemDTO[]) => Promise<CartItem[]>;
}

@Repository({ token: RepoTokens.CART, scope: Scope.SINGLETON })
export class CartRepo extends EavEntityRepo implements ICartRepo {
    constructor(
        @Inject(DAOTokens.CART) private _cartDAO: ICartDAO,
        @Inject(DAOTokens.CART_ATTRIBUTE) private _cartAttributeDAO: ICartAttributeDAO,
        @Inject(DAOTokens.CART_ATTRIBUTE_VALUE) private _cartAttributeValueDAO: ICartAttributeValueDAO,
        @Inject(DAOTokens.CART_ITEM) private _cartItemsDAO: ICartItemDAO,
        @Inject(MapperTokens.CART_ITEM) private _cartItemMapper: ICartItemMapper,
        @Inject(MapperTokens.CART) private _cartMapper: ICartMapper,
        @Inject(EavMapperTokens.ATTRIBUTE) private _cartAttributeMapper: IEavAttributeMapper,
        @Inject(EavMapperTokens.ATTRIBUTE_VALUE) private _cartAttributeValueMapper: IEavAttributeValueMapper,
    ) {
        super(_cartAttributeMapper, _cartAttributeDAO);
    }

    public async create(input: CartCreateInput) {
        const cart = new Cart();
        await cart.create(input);

        if (input.attributeValues) {
            const allAttributes = await EavUtil.getAllAttributes(
                this._cartAttributeMapper,
                this._cartAttributeDAO,
            );
            const attributeValuesInput = await EavUtil.getCreateAttributeValuesInput(
                allAttributes,
                input.attributeValues,
            );
            await cart.eav.createAttributeValues(attributeValuesInput);
        }

        const dto = this._cartMapper.fromEntityToDTO(cart);

        await this._cartDAO.transaction(async (trx) => {
            await this._cartDAO.create(dto, { trx });
            if (dto.attributeValues)
                await this._cartAttributeValueDAO.createList(dto.attributeValues, { trx });
        });

        return cart;
    }

    public async update(id: string, input: CartUpdateInput) {
        const cart = await this.getById(id, input.userId);
        await cart.update(input);

        let changeAttrOutput: Optional<EavEntityChangeAttributesValuesOutput>;
        if (input.attributeValues) {
            const allAttributes = await EavUtil.getAllAttributes(
                this._cartAttributeMapper,
                this._cartAttributeDAO,
            );
            const attributeValuesInput = await EavUtil.getUpdateAttributeValuesInput(
                allAttributes,
                input.attributeValues,
            );
            changeAttrOutput = await cart.eav.changeAttributeValues(attributeValuesInput);
        }
        await this._cartDAO.transaction((trx) =>
            Promise.all([
                this._cartDAO.updateById(cart.id, this._cartMapper.fromEntityToDTO(cart), {
                    trx,
                }),

                changeAttrOutput
                    ? this._cartAttributeValueDAO.deleteList(
                          changeAttrOutput.deletedItems.map((d) => d.id),
                          { trx },
                      )
                    : undefined,
                changeAttrOutput
                    ? this._cartAttributeValueDAO.updateList(
                          changeAttrOutput.updatedItems.map((u) =>
                              this._cartAttributeValueMapper.fromEntityToDTO(u),
                          ),
                          { trx },
                      )
                    : undefined,
                changeAttrOutput
                    ? this._cartAttributeValueDAO.createList(
                          changeAttrOutput.createdItems.map((c) =>
                              this._cartAttributeValueMapper.fromEntityToDTO(c),
                          ),
                          { trx },
                      )
                    : undefined,
            ]),
        );
        return cart;
    }

    public async delete(id: string, userId: string, cart?: Cart, isCreator?: boolean) {
        if (!cart) cart = await this.getById(id, userId, false, false, isCreator);
        await cart.delete();
        await this._cartDAO.deleteById(cart.id);
        return id;
    }

    public async getById(
        id: string,
        userId: string,
        includeItems?: boolean,
        includeAttr?: boolean,
        isCreator?: boolean,
    ) {
        const resolveOptions = [] as ResolveOption<CartDTO>;
        let isResolve = false;
        if (includeItems) {
            resolveOptions.push('items');
        }
        if (includeAttr) {
            resolveOptions.push('attributeValues');
        }
        if (resolveOptions.length) isResolve = true;
        const dto = (await this._cartDAO.findOne(
            {
                filter: {
                    id: { eq: id },
                    enabled: { eq: true },
                },
            },
            {
                resolve: isResolve ? resolveOptions : undefined,
                useMaster: true,
            },
        )) as Optional<CartDTO>;
        if (!dto) throw new CartNotFoundError();
        if (isCreator) {
            if (dto.creatorId !== userId) throw new CartNotBelongToUserError();
        } else {
            if (dto.userId !== userId) throw new CartNotBelongToUserError();
        }
        return this._cartMapper.fromDTOToEntity(dto);
    }

    public async getActiveForUser(
        userId: string,
        targetId: Nullable<string>,
        includeItems?: boolean,
        includeAttr?: boolean,
    ) {
        const resolveOptions = [] as ResolveOption<CartDTO>;
        let isResolve = false;
        if (includeItems) {
            resolveOptions.push('items');
        }
        if (includeAttr) {
            resolveOptions.push('attributeValues');
        }
        if (resolveOptions.length) isResolve = true;
        const dto = (await this._cartDAO.findOne(
            {
                filter: {
                    userId: { eq: userId },
                    targetId: { eq: targetId },
                    enabled: { eq: true },
                },
            },
            {
                resolve: isResolve ? resolveOptions : undefined,
                useMaster: true,
            },
        )) as Optional<CartDTO>;
        return dto ? this._cartMapper.fromDTOToEntity(dto) : dto;
    }

    public async createItem(input: CartItemCreateInput): Promise<CartItem> {
        const cartItem = new CartItem();
        await cartItem.create(input);
        const dto = this._cartItemMapper.fromEntityToDTO(cartItem);
        await this._cartItemsDAO.create(dto);
        return cartItem;
    }

    public async upsertListItem(listDTO: CartItemDTO[]): Promise<CartItem[]> {
        await this._cartItemsDAO.upsertList(listDTO);
        return listDTO.map((dto) => this._cartItemMapper.fromDTOToEntity(dto));
    }

    public async updateItem(cartItem: CartItem, input: CartItemUpdateInput): Promise<CartItem> {
        await cartItem.update(input);
        const dto = this._cartItemMapper.fromEntityToDTO(cartItem);
        await this._cartItemsDAO.updateById(cartItem.id, dto);
        return cartItem;
    }

    public async deleteItem(itemId: string, cartItem?: CartItem): Promise<string> {
        if (!cartItem) cartItem = await this.getItemById(itemId);
        await cartItem.delete();
        await this._cartItemsDAO.deleteById(itemId);
        return cartItem.id;
    }

    public async getItemByProductId(cartId: string, productId: string, throwErr?: boolean) {
        const itemDto = (await this._cartItemsDAO.findOne({
            filter: {
                cartId: { eq: cartId },
                productId: { eq: productId },
            },
        })) as Optional<CartItemDTO>;
        if (throwErr && !itemDto) {
            throw new CartItemNotFoundError();
        }
        if (itemDto) return this._cartItemMapper.fromDTOToEntity(itemDto);
    }

    public async getItemById(id: string, throwErr?: boolean) {
        const itemDto = (await this._cartItemsDAO.findOne({
            filter: {
                id: { eq: id },
            },
        })) as CartItemDTO;
        if (throwErr && !itemDto) {
            throw new CartItemNotFoundError();
        }
        return this._cartItemMapper.fromDTOToEntity(itemDto);
    }

    public async getListItemByListId(listIds: string[], throwErr?: boolean): Promise<CartItemDTO[]> {
        const itemDTOs = (await this._cartItemsDAO.find({
            filter: {
                id: { in: listIds },
            },
        })) as CartItemDTO[];
        const listItemNotFound = [];
        if (throwErr) {
            for (const id of listIds) {
                let found = false;
                for (const dto of itemDTOs) {
                    if (dto.id === id) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    listItemNotFound.push(id);
                }
            }
            if (listItemNotFound.length) throw new CartItemNotFoundError(listItemNotFound);
        }
        return itemDTOs;
    }

    public async getAllItem(userId: string, isCreator?: boolean): Promise<CartItemDTO[]> {
        let carts;
        if (isCreator) {
            carts = await this._cartDAO.find(
                {
                    filter: {
                        creatorId: { eq: userId },
                        enabled: { eq: true },
                    },
                },
                { resolve: ['items'], useMaster: true },
            );
        } else {
            carts = await this._cartDAO.find(
                {
                    filter: {
                        userId: { eq: userId },
                        enabled: { eq: true },
                    },
                },
                {
                    resolve: ['items'],
                    useMaster: true,
                },
            );
        }
        const itemDTOs = [] as CartItemDTO[];
        for (const cart of carts) {
            if (cart.items) {
                for (const item of cart.items) {
                    itemDTOs.push(item);
                }
            }
        }
        if (itemDTOs.length < 1) {
            throw new CartItemNotFoundError();
        }
        return itemDTOs;
    }

    public async deleteListItemByListId(listIds: string[]): Promise<string[]> {
        return this._cartItemsDAO.deleteList(listIds);
    }
}
