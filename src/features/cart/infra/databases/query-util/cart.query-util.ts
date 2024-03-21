import { BaseTable } from '@cbidigital/aqua';
import { BaseQueryUtil } from '@cbidigital/aqua/database/query-util';
import { DatabaseLookup, ModuleDatabase, Provider, Scope } from '@heronjs/common';
import { KnexClient } from '@heronjs/core';
import { TableNames, CartTokens } from '../../../../../constants';
import { CartAttributeTable, CartAttributeValueTable, CartItemsTable, CartTable } from '../tables';

@Provider({
    token: CartTokens.CART_QUERY_UTIL,
    scope: Scope.SINGLETON,
})
export class CartQueryUtil extends BaseQueryUtil {
    constructor(@DatabaseLookup() db: ModuleDatabase<KnexClient>) {
        // Define all tables
        const tables = new Map<string, BaseTable>([
            [TableNames.CART, new CartTable()],
            [TableNames.CART_ITEMS, new CartItemsTable()],
            [TableNames.CART_ATTRIBUTE, new CartAttributeTable()],
            [TableNames.CART_ATTRIBUTE_VALUE, new CartAttributeValueTable()],
        ]);
        super({ db, tables });
    }
}
