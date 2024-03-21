import { Inject, Nullable, Provider, Scope } from '@heronjs/common';
import { CartTokens, ProviderTokens, RepoTokens, UseCaseTokens } from '../../../../../../../constants';
import { ICartRepo } from '../../../../../domain/repos';

import { IProductProvider } from '../../../../../domain/providers/product';
import { IProductValidator } from '../../../../../domain/utils/validator/product';
import { AddItemUseCaseInput, AddListItemUseCaseInput } from '../types';
import { CartAddItemInput } from '../../../../../domain/aggregates';
import { CartItemDTO } from '../../../../../domain/dtos';

export type ICartUseCaseUtils = {
    addItem: (userId: string, creatorId: Nullable<string>, input: AddItemUseCaseInput) => Promise<void>;

    addListItem: (
        userId: string,
        creatorId: Nullable<string>,
        input: AddListItemUseCaseInput,
    ) => Promise<void>;
};

@Provider({ token: UseCaseTokens.CART_UTILS, scope: Scope.REQUEST })
export class CartUseCaseUtils implements ICartUseCaseUtils {
    constructor(
        @Inject(RepoTokens.CART) private readonly _repo: ICartRepo,
        @Inject(ProviderTokens.PRODUCT_PROVIDER) private _productProvider: IProductProvider,
        @Inject(CartTokens.PRODUCT_VALIDATOR) private _productValidator: IProductValidator,
    ) {}

    public async addItem(
        userId: string,
        creatorId: Nullable<string>,
        input: AddItemUseCaseInput,
    ): Promise<void> {
        const product = await this._productProvider.getProductById(input.productId, input.stockId);
        const cart = await this._repo.getActiveForUser(userId, product.targetId);
        let cartId;
        if (cart) {
            cartId = cart.id;
            const cartItem = await this._repo.getItemByProductId(cart.id, product.id);
            if (cartItem) {
                const itemInput = {
                    ...input,
                    qty: input.qty + cartItem.qty,
                };
                this._productValidator.checkProductBeforeAddToCart(product, itemInput);
                await this._repo.updateItem(cartItem, {
                    qty: input.qty,
                    isPlus: true,
                    customPrice: creatorId ? input.customPrice : undefined,
                });
                return;
            }
        } else {
            this._productValidator.checkProductBeforeAddToCart(product, input);
            const newCart = await this._repo.create({
                userId,
                creatorId,
                targetId: product.targetId,
                enabled: true,
            });
            cartId = newCart.id;
        }
        await this._repo.createItem({
            cartId,
            productId: product.id,
            qty: input.qty,
            stockId: input.stockId,
            customPrice: creatorId ? input.customPrice : undefined,
        });
    }

    public async addListItem(
        userId: string,
        creatorId: Nullable<string>,
        input: AddListItemUseCaseInput,
    ): Promise<void> {
        const mapItemsByStockId: Record<string, CartAddItemInput[]> = {};
        const mapTargetId: Record<string, CartAddItemInput[]> = {};
        const mapItemCustomPrice: Record<string, number | undefined> = {};

        for (const item of input.items) {
            if (item.stockId) {
                if (!mapItemsByStockId[item.stockId]) mapItemsByStockId[item.stockId] = [];
                mapItemsByStockId[item.stockId].push(item);
            } else {
                if (!mapItemsByStockId['noStockId']) mapItemsByStockId['noStockId'] = [];
                mapItemsByStockId['noStockId'].push(item);
            }
            mapItemCustomPrice[item.productId] = item.customPrice;
        }
        for (const stockId in mapItemsByStockId) {
            const listProductId = [];
            const mapProductIdQty: Record<string, number> = {};
            for (const item of mapItemsByStockId[stockId]) {
                mapProductIdQty[item.productId] = item.qty;
                listProductId.push(item.productId);
            }
            const productStockId = stockId !== 'noStockId' ? stockId : undefined;
            const mapProducts = await this._productProvider.getMapProductsByListIds(
                listProductId,
                productStockId,
            );

            for (const productId of listProductId) {
                const product = mapProducts[productId];
                this._productValidator.checkProductExist(product, productId);
                const targetId = product.targetId;
                const customPrice = creatorId ? mapItemCustomPrice[productId] : undefined;
                if (targetId) {
                    if (!mapTargetId[targetId]) mapTargetId[targetId] = [];
                    mapTargetId[targetId].push({
                        productId,
                        qty: mapProductIdQty[productId],
                        stockId: productStockId,
                        product,
                        customPrice,
                    });
                } else {
                    if (!mapTargetId['noTargetId']) mapTargetId['noTargetId'] = [];
                    mapTargetId['noTargetId'].push({
                        productId,
                        qty: mapProductIdQty[productId],
                        stockId: productStockId,
                        product,
                        customPrice,
                    });
                }
            }
        }
        for (const targetId in mapTargetId) {
            const finalTargetId = targetId === 'noTargetId' ? null : targetId;
            const cart = await this._repo.getActiveForUser(userId, finalTargetId, true);
            if (cart) {
                await cart.updateItems({ items: mapTargetId[targetId] });
                if (cart.items) {
                    this.isValidCartItems(cart.items);
                    await this._repo.upsertListItem(cart.items);
                }
            } else {
                const newCart = await this._repo.create({
                    userId,
                    creatorId,
                    targetId: finalTargetId,
                    enabled: true,
                });
                await newCart.updateItems({ items: mapTargetId[targetId] });
                if (newCart.items) {
                    this.isValidCartItems(newCart.items);
                    await this._repo.upsertListItem(newCart.items);
                }
            }
        }
    }

    private isValidCartItems(items: CartItemDTO[]): void {
        for (const item of items) {
            this._productValidator.checkProductBeforeAddToCart(item.product!, {
                productId: item.productId,
                qty: item.qty,
            });
        }
        return;
    }
}
