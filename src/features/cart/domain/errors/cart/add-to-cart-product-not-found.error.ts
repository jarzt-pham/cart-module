import { RuntimeError } from '@heronjs/common';
import { ErrorNamespaces, CartErrorCodes } from '..';

export class AddToCartProductNotFoundError extends RuntimeError {
    constructor(productId: string) {
        super(
            ErrorNamespaces.CART,
            CartErrorCodes.ADD_TO_CART_PRODUCT_NOT_FOUND,
            'Product' + productId + ' not found (Add to cart)',
        );
    }
}
