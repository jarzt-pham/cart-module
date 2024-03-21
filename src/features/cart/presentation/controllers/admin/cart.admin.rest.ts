import { Post, Inject, Rest, Guard, Principal, Body, Delete, Param, Patch, Get } from '@heronjs/common';
import { UseCaseTokens } from '../../../../../constants';
import {
    IAdminAddItemUseCase,
    IAdminAddListItemUseCase,
    IAdminUpdateItemUseCase,
    IDeleteCartUseCase,
    IPlaceOrderUseCase,
    IPreCheckoutUseCase,
    IRemoveItemUseCase,
    IUpdateItemQtyUseCase,
} from '../../../app/usecases/cart/command';
import {
    AdminAddItemUseCaseInput,
    AdminAddListItemUseCaseInput,
    AdminUpdateItemUseCaseInput,
    PlaceOrderUseCaseInput,
    PreCheckoutUseCaseInput,
} from '../../../app/usecases/cart/command/types';
import { StatusCodes } from 'http-status-codes';
import { IGetListCartUseCase } from '../../../app/usecases/cart/query';
import { GetListCartUseCaseInput } from '../../../app/usecases/cart/query/types';

@Rest('/admin/carts')
export class CartAdminRest {
    constructor(
        @Inject(UseCaseTokens.ADMIN_ADD_ITEM) private readonly _adminAddItemUseCase: IAdminAddItemUseCase,
        @Inject(UseCaseTokens.ADMIN_ADD_LIST_ITEM)
        private readonly _adminAddListItemUseCase: IAdminAddListItemUseCase,
        @Inject(UseCaseTokens.ADMIN_REMOVE_ITEM)
        private readonly _adminRemoveItemUseCase: IRemoveItemUseCase,
        @Inject(UseCaseTokens.ADMIN_DELETE_CART) private readonly _adminDeleteCartUseCase: IDeleteCartUseCase,
        @Inject(UseCaseTokens.ADMIN_UPDATE_ITEM_QTY)
        private readonly _adminUpdateItemQtyUseCase: IUpdateItemQtyUseCase,
        @Inject(UseCaseTokens.ADMIN_UPDATE_ITEM)
        private readonly _adminUpdateItemUseCase: IAdminUpdateItemUseCase,
        @Inject(UseCaseTokens.PRE_CHECKOUT) private readonly _preCheckoutUseCase: IPreCheckoutUseCase,
        @Inject(UseCaseTokens.PLACE_ORDER) private readonly _placeOrderUseCase: IPlaceOrderUseCase,
        @Inject(UseCaseTokens.ADMIN_GET_LIST_CART)
        private readonly _adminGetListCartUseCase: IGetListCartUseCase,
    ) {}

    @Post({ uri: '/add-items', code: StatusCodes.NO_CONTENT })
    @Guard({ private: true })
    public async addListItem(@Body() body: AdminAddListItemUseCaseInput, @Principal('sub') authId: string) {
        return this._adminAddListItemUseCase.exec(body, {
            auth: {
                isAdmin: true,
                authId,
            },
        });
    }

    @Post({ uri: '/add-item', code: StatusCodes.NO_CONTENT })
    @Guard({ private: true })
    public async addItem(@Body() body: AdminAddItemUseCaseInput, @Principal('sub') authId: string) {
        return this._adminAddItemUseCase.exec(body, {
            auth: {
                isAdmin: true,
                authId,
            },
        });
    }

    @Delete({ uri: '/remove-item/:itemId', code: StatusCodes.NO_CONTENT })
    @Guard({ private: true })
    public async removeItem(@Param('itemId') itemId: string, @Principal('sub') authId: string) {
        return this._adminRemoveItemUseCase.exec(
            { itemId },
            {
                auth: {
                    isAdmin: true,
                    authId,
                },
            },
        );
    }

    @Delete({ uri: '/:cartId', code: StatusCodes.NO_CONTENT })
    @Guard({ private: true })
    public async delete(@Param('cartId') cartId: string, @Principal('sub') authId: string) {
        return this._adminDeleteCartUseCase.exec(
            { id: cartId },
            {
                auth: {
                    isAdmin: true,
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
        return this._adminUpdateItemQtyUseCase.exec(
            {
                itemId,
                qty: body.qty,
            },
            {
                auth: {
                    isAdmin: true,
                    authId,
                },
            },
        );
    }

    @Patch({ uri: '/update-item/:itemId', code: StatusCodes.NO_CONTENT })
    @Guard({ private: true })
    public async updateItem(
        @Param('itemId') itemId: string,
        @Body() body: AdminUpdateItemUseCaseInput,
        @Principal('sub') authId: string,
    ) {
        return this._adminUpdateItemUseCase.exec(
            {
                ...body,
                itemId,
            },
            {
                auth: {
                    isAdmin: true,
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
                isAdmin: true,
                authId,
            },
        });
    }

    @Post({ uri: '/place-order', code: StatusCodes.OK })
    @Guard({ private: true })
    public async placeOrder(@Body() body: PlaceOrderUseCaseInput, @Principal('sub') authId: string) {
        return this._placeOrderUseCase.exec(body, {
            auth: {
                isAdmin: true,
                authId,
            },
        });
    }

    @Get({ uri: '/', code: StatusCodes.OK })
    @Guard({ private: true })
    public async getListCart(@Body() body: GetListCartUseCaseInput, @Principal('sub') authId: string) {
        return this._adminGetListCartUseCase.exec(body, {
            auth: {
                isAdmin: true,
                authId,
            },
        });
    }
}
