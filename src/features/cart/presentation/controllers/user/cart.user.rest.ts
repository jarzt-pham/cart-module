import { Post, Inject, Rest, Guard, Principal, Body, Delete, Param, Patch, Get } from '@heronjs/common';
import { UseCaseTokens } from '../../../../../constants';
import {
    IAddItemUseCase,
    IAddListItemUseCase,
    IRemoveItemUseCase,
    IDeleteCartUseCase,
    IUpdateItemQtyUseCase,
    IRemoveNotAvailableItemsUseCase,
    IPreCheckoutUseCase,
    IPlaceOrderUseCase,
} from '../../../app/usecases/cart/command';
import {
    AddItemUseCaseInput,
    AddListItemUseCaseInput,
    PlaceOrderUseCaseInput,
    PreCheckoutUseCaseInput,
} from '../../../app/usecases/cart/command/types';
import { StatusCodes } from 'http-status-codes';
import { IGetListCartUseCase, IGetItemByProductIdUseCase } from '../../../app/usecases/cart/query';
import { GetListCartUseCaseInput } from '../../../app/usecases/cart/query/types';

@Rest('/carts')
export class CartUserRest {
    constructor(
        @Inject(UseCaseTokens.ADD_ITEM) private readonly _addItemUseCase: IAddItemUseCase,
        @Inject(UseCaseTokens.ADD_LIST_ITEM) private readonly _addListItemUseCase: IAddListItemUseCase,
        @Inject(UseCaseTokens.REMOVE_ITEM) private readonly _removeItemUseCase: IRemoveItemUseCase,
        @Inject(UseCaseTokens.DELETE_CART) private readonly _deleteCartUseCase: IDeleteCartUseCase,
        @Inject(UseCaseTokens.UPDATE_ITEM_QTY) private readonly _updateItemQtyUseCase: IUpdateItemQtyUseCase,
        @Inject(UseCaseTokens.PRE_CHECKOUT) private readonly _preCheckoutUseCase: IPreCheckoutUseCase,
        @Inject(UseCaseTokens.PLACE_ORDER) private readonly _placeOrderUseCase: IPlaceOrderUseCase,
        @Inject(UseCaseTokens.REMOVE_NOT_AVAILABLE_ITEMS)
        private readonly _removeNotAvailableItemsUseCase: IRemoveNotAvailableItemsUseCase,
        @Inject(UseCaseTokens.GET_LIST_CART)
        private readonly _getListCartUseCase: IGetListCartUseCase,
        @Inject(UseCaseTokens.GET_ITEM_BY_PRODUCT_ID)
        private readonly _getItemByProductIdUseCase: IGetItemByProductIdUseCase,
    ) {}

    @Post({ uri: '/add-items', code: StatusCodes.NO_CONTENT })
    @Guard({ private: true })
    public async addItems(@Body() body: AddListItemUseCaseInput, @Principal('sub') authId: string) {
        return this._addListItemUseCase.exec(body, {
            auth: {
                isAdmin: false,
                authId,
            },
        });
    }

    @Post({ uri: '/add-item', code: StatusCodes.NO_CONTENT })
    @Guard({ private: true })
    public async addItem(@Body() body: AddItemUseCaseInput, @Principal('sub') authId: string) {
        return this._addItemUseCase.exec(body, {
            auth: {
                isAdmin: false,
                authId,
            },
        });
    }

    @Delete({ uri: '/remove-item/:itemId', code: StatusCodes.NO_CONTENT })
    @Guard({ private: true })
    public async removeItem(@Param('itemId') itemId: string, @Principal('sub') authId: string) {
        return this._removeItemUseCase.exec(
            { itemId },
            {
                auth: {
                    isAdmin: false,
                    authId,
                },
            },
        );
    }

    @Delete({ uri: '/remove-not-available-items', code: StatusCodes.NO_CONTENT })
    @Guard({ private: true })
    public async removeNotAvailableItems(@Principal('sub') authId: string) {
        return this._removeNotAvailableItemsUseCase.exec(undefined, {
            auth: {
                isAdmin: false,
                authId,
            },
        });
    }

    @Delete({ uri: '/:cartId', code: StatusCodes.NO_CONTENT })
    @Guard({ private: true })
    public async delete(@Param('cartId') cartId: string, @Principal('sub') authId: string) {
        return this._deleteCartUseCase.exec(
            { id: cartId },
            {
                auth: {
                    isAdmin: false,
                    authId,
                },
            },
        );
    }

    @Patch({ uri: '/update-item-qty/:itemId', code: StatusCodes.NO_CONTENT })
    @Guard({ private: true })
    public async updateItemQty(
        @Param('itemId') itemId: string,
        @Body() body: { qty: number },
        @Principal('sub') authId: string,
    ) {
        return this._updateItemQtyUseCase.exec(
            {
                itemId,
                qty: body.qty,
            },
            {
                auth: {
                    isAdmin: false,
                    authId,
                },
            },
        );
    }

    @Post({ uri: '/pre-checkout', code: StatusCodes.OK })
    @Guard({ private: true })
    public async preCheckout(@Body() body: PreCheckoutUseCaseInput, @Principal('sub') authId: string) {
        return this._preCheckoutUseCase.exec(body, {
            auth: {
                isAdmin: false,
                authId,
            },
        });
    }

    @Post({ uri: '/place-order', code: StatusCodes.OK })
    @Guard({ private: true })
    public async placeOrder(@Body() body: PlaceOrderUseCaseInput, @Principal('sub') authId: string) {
        return this._placeOrderUseCase.exec(body, {
            auth: {
                isAdmin: false,
                authId,
            },
        });
    }

    @Get({ uri: '/getItemByProductId/:id', code: StatusCodes.OK })
    @Guard({ private: true })
    public async getItemByProductId(
        @Body() body: any,
        @Param('id') id: string,
        @Principal('sub') authId: string,
    ) {
        return this._getItemByProductIdUseCase.exec(
            {
                ...body,
                productId: id,
            },
            {
                auth: {
                    isAdmin: false,
                    authId,
                },
            },
        );
    }

    @Get({ uri: '/', code: StatusCodes.OK })
    @Guard({ private: true })
    public async getListCart(@Body() body: GetListCartUseCaseInput, @Principal('sub') authId: string) {
        return this._getListCartUseCase.exec(body, {
            auth: {
                isAdmin: false,
                authId,
            },
        });
    }
}
