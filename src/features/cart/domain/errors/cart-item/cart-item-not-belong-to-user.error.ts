import { RuntimeError } from '@heronjs/common';
import { ErrorNamespaces, CartItemErrorCodes } from '..';

export class CartItemNotBelongToUserError extends RuntimeError {
    constructor() {
        super(
            ErrorNamespaces.CART_ITEM,
            CartItemErrorCodes.NOT_BELONG_TO_USER,
            'Cart have item(s) that not belong to user',
        );
    }
}
