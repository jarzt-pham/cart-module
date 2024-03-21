import { BaseDao, EavAttributeDTO, IBaseDao } from '@cbidigital/aqua';
import { IQueryUtil } from '@cbidigital/aqua/database/query-util';
import { Scope, DatabaseLookup, ModuleDatabase, Dao, Inject, Logger } from '@heronjs/common';
import { KnexClient } from '@heronjs/core';
import { DAOTokens, TableNames, CartTokens } from '../../../../../constants';

export type ICartAttributeDAO = IBaseDao<EavAttributeDTO>;

@Dao({ token: DAOTokens.CART_ATTRIBUTE, scope: Scope.SINGLETON })
export class CartAttributeDAO extends BaseDao<EavAttributeDTO> implements ICartAttributeDAO {
    constructor(
        @DatabaseLookup() db: ModuleDatabase<KnexClient>,
        @Inject(CartTokens.CART_QUERY_UTIL) queryUtil: IQueryUtil<EavAttributeDTO>,
    ) {
        super({ db, queryUtil, tableName: TableNames.CART_ATTRIBUTE });
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
