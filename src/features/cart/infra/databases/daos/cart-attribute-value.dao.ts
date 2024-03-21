import { BaseDao, EavAttributeValueDTO, IBaseDao } from '@cbidigital/aqua';
import { IQueryUtil } from '@cbidigital/aqua/database/query-util';
import { Scope, DatabaseLookup, ModuleDatabase, Dao, Inject } from '@heronjs/common';
import { KnexClient } from '@heronjs/core';
import { DAOTokens, TableNames, CartTokens } from '../../../../../constants';

export type ICartAttributeValueDAO = IBaseDao<EavAttributeValueDTO>;

@Dao({ token: DAOTokens.CART_ATTRIBUTE_VALUE, scope: Scope.SINGLETON })
export class CartAttributeValueDAO extends BaseDao<EavAttributeValueDTO> implements ICartAttributeValueDAO {
    constructor(
        @DatabaseLookup() db: ModuleDatabase<KnexClient>,
        @Inject(CartTokens.CART_QUERY_UTIL) queryUtil: IQueryUtil<EavAttributeValueDTO>,
    ) {
        super({ db, queryUtil, tableName: TableNames.CART_ATTRIBUTE_VALUE });
    }
}
