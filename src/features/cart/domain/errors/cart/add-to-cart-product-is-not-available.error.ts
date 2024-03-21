import { RuntimeError } from '@heronjs/common';
import { ErrorNamespaces, CartErrorCodes } from '..';

export class AddToCartProductIsNotAvailableError extends RuntimeError {
    constructor(productId: string) {
        super(
            ErrorNamespaces.CART,
            CartErrorCodes.ADD_TO_CART_PRODUCT_NOT_FOUND,
            'Product ' + productId + ' that you are trying to add is not available',
        );
    }
}
