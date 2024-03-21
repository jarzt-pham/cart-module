import {
    CreateEavAttributeUseCaseInput,
    ICreateEavAttributeUseCase,
    IDeleteEavAttributeUseCase,
    IGetEavAttributeUseCase,
    IGetListEavAttributeUseCase,
    IUpdateEavAttributeUseCase,
} from '@cbidigital/aqua';
import { Body, Delete, Get, Inject, Param, Patch, Post, Query, Rest, Guard } from '@heronjs/common';
import { StatusCodes } from 'http-status-codes';
import { SortInput } from '@cbidigital/aqua/database/query-util';
import { UseCaseTokens } from '../../../../../constants';

@Rest('/admin/carts/attributes')
export class CartAttributeAdminRest {
    constructor(
        private readonly _createCartAttributeUseCase: ICreateEavAttributeUseCase,
        @Inject(UseCaseTokens.UPDATE_CART_ATTRIBUTE)
        private readonly _updateCartAttributeUseCase: IUpdateEavAttributeUseCase,
        @Inject(UseCaseTokens.DELETE_CART_ATTRIBUTE)
        private readonly _deleteCartAttributeUseCase: IDeleteEavAttributeUseCase,
        @Inject(UseCaseTokens.GET_CART_ATTRIBUTE)
        private readonly _getCartAttributeUseCase: IGetEavAttributeUseCase,
        @Inject(UseCaseTokens.GET_LIST_CART_ATTRIBUTE)
        private readonly _getListCartAttributeUseCase: IGetListEavAttributeUseCase,
    ) {}

    @Post({ uri: '/attributes/', code: StatusCodes.CREATED })
    @Guard({ private: true })
    public async createAttribute(@Body() body: CreateEavAttributeUseCaseInput) {
        return this._createCartAttributeUseCase.exec(body);
    }

    @Patch({ uri: '/attributes/:id' })
    @Guard({ private: true })
    public async updateAttribute(@Param('id') id: string, @Body() body: any) {
        return this._updateCartAttributeUseCase.exec({
            ...body,
            code: id,
        });
    }

    @Delete({ uri: '/attributes/:id', code: StatusCodes.NO_CONTENT })
    @Guard({ private: true })
    public async deleteAttribute(@Param('id') id: string) {
        return this._deleteCartAttributeUseCase.exec({
            code: id,
        });
    }

    @Get({ uri: '/attributes/:code' })
    @Guard({ private: true })
    public async getAttributeByCode(@Param('code') code: string) {
        return this._getCartAttributeUseCase.exec(code);
    }

    @Get({ uri: '/attributes' })
    @Guard({ private: true })
    public async getListAttribute(
        @Query('filter') filter: any,
        @Query('eavFilter') eavFilter: any,
        @Query('offset') offset: number,
        @Query('limit') limit: number,
        @Query('sort') sort: SortInput,
    ) {
        return this._getListCartAttributeUseCase.exec({
            offset,
            limit,
            sort,
            filter,
            eavFilter,
        });
    }
}
