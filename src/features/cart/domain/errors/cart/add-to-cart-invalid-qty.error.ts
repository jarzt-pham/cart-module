import { RuntimeError } from '@heronjs/common';
import { ErrorNamespaces, CartErrorCodes } from '..';

export class AddToCartInvalidQtyError extends RuntimeError {
    constructor(productId: string) {
        super(
            ErrorNamespaces.CART,
            CartErrorCodes.ADD_TO_CART_PRODUCT_NOT_FOUND,
            'Add to cart invalid product qty. Product ID: ' + productId,
        );
    }
}
