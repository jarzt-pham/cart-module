import { BaseDao, IBaseDao } from '@cbidigital/aqua';
import { IQueryUtil } from '@cbidigital/aqua/database/query-util';
import { Scope, DatabaseLookup, ModuleDatabase, Dao, Logger, Inject } from '@heronjs/common';
import { KnexClient } from '@heronjs/core';
import { DAOTokens, TableNames, CartTokens } from '../../../../../constants';
import { CartItemDTO } from '../../../domain/dtos';

export type ICartItemDAO = IBaseDao<CartItemDTO>;

@Dao({ token: DAOTokens.CART_ITEM, scope: Scope.SINGLETON })
export class CartItemDAO extends BaseDao<CartItemDTO> implements ICartItemDAO {
    constructor(
        @DatabaseLookup() db: ModuleDatabase<KnexClient>,
        @Inject(CartTokens.CART_QUERY_UTIL) queryUtil: IQueryUtil<CartItemDTO>,
    ) {
        super({ db, queryUtil, tableName: TableNames.CART_ITEMS });
    }

    protected _transformError(err: any) {
        const logger = new Logger(this.constructor.name);
        logger.error(err);

        switch (err.constraint) {
            default:
                throw err;
        }
    }
}
