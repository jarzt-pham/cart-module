import { RuntimeError } from '@heronjs/common';
import { ErrorNamespaces, CartErrorCodes } from '..';

export class CartNotEnabledError extends RuntimeError {
    constructor() {
        super(ErrorNamespaces.CART, CartErrorCodes.NOT_FOUND, 'Cart not enabled');
    }
}
