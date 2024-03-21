import { RuntimeError } from '@heronjs/common';
import { ErrorNamespaces, CartItemErrorCodes } from '..';

export class CartItemNotFoundError extends RuntimeError {
    constructor(ids?: string[]) {
        let stringIds = ' Ids : ';
        if (ids) {
            stringIds += ids.toString();
        } else {
            stringIds = '';
        }
        super(ErrorNamespaces.CART_ITEM, CartItemErrorCodes.NOT_FOUND, 'Cart item(s) not found.' + stringIds);
    }
}
