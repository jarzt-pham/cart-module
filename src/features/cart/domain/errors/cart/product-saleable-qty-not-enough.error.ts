import { RuntimeError } from '@heronjs/common';
import { ErrorNamespaces, CartErrorCodes } from '..';

export class ProductSaleableQtyNotEnoughError extends RuntimeError {
    constructor(productId: string) {
        super(
            ErrorNamespaces.CART,
            CartErrorCodes.PRODUCT_SALEABLE_QTY_NOT_ENOUGH,
            'Product ' + productId + ' saleable qty not enough',
        );
    }
}
