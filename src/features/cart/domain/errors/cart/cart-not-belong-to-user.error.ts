import { RuntimeError } from '@heronjs/common';
import { ErrorNamespaces, CartErrorCodes } from '..';

export class CartNotBelongToUserError extends RuntimeError {
    constructor() {
        super(ErrorNamespaces.CART, CartErrorCodes.NOT_FOUND, 'Cart not belong to user');
    }
}
