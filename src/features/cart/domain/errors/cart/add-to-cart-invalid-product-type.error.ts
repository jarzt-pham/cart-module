import { RuntimeError } from '@heronjs/common';
import { ErrorNamespaces, CartErrorCodes } from '..';

export class AddToCartInvalidProductTypeError extends RuntimeError {
    constructor(productId: string) {
        super(
            ErrorNamespaces.CART,
            CartErrorCodes.ADD_TO_CART_INVALID_PRODUCT_TYPE,
            'Add to cart product type must be SIMPLE_PRODUCT. Product ID: ' + productId,
        );
    }
}
