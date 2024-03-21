import { BaseDao, IBaseDao } from '@cbidigital/aqua';
import { IQueryUtil } from '@cbidigital/aqua/database/query-util';
import { Scope, DatabaseLookup, ModuleDatabase, Dao, Logger, Inject } from '@heronjs/common';
import { KnexClient } from '@heronjs/core';
import { DAOTokens, TableNames, CartTokens } from '../../../../../constants';
import { CartDTO } from '../../../domain/dtos';

export type ICartDAO = IBaseDao<CartDTO>;

@Dao({ token: DAOTokens.CART, scope: Scope.SINGLETON })
export class CartDAO extends BaseDao<CartDTO> implements ICartDAO {
    constructor(
        @DatabaseLookup() db: ModuleDatabase<KnexClient>,
        @Inject(CartTokens.CART_QUERY_UTIL) queryUtil: IQueryUtil<CartDTO>,
    ) {
        super({ db, queryUtil, tableName: TableNames.CART });
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
