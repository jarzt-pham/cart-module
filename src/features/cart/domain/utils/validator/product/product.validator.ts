import { ProductGetOutput } from '@cbidigital/inventory-module/features/product/app/useCases';
import {
    AddToCartInvalidProductTypeError,
    AddToCartInvalidQtyError,
    AddToCartProductNotFoundError,
    ProductSaleableQtyNotEnoughError,
} from '../../../errors';
import { Provider, Scope } from '@heronjs/common';
import { CartTokens, MAX_VALUE_INTEGER_DATABASE } from '../../../../../../constants';
import { ItemTypes } from '@cbidigital/item-module/features/item/domain/enums';
import { AddToCartProductIsNotAvailableError } from '../../../errors/cart/add-to-cart-product-is-not-available.error';
import { CartAddItemInput } from '../../../aggregates';

export interface IProductValidator {
    checkProductBeforeAddToCart: (product: ProductGetOutput, addToCartInput: CartAddItemInput) => void;
    checkProductExist: (product: ProductGetOutput, productId: string) => void;
}

@Provider({ token: CartTokens.PRODUCT_VALIDATOR, scope: Scope.SINGLETON })
export class ProductValidator implements IProductValidator {
    checkProductBeforeAddToCart(product: ProductGetOutput, addToCartInput: CartAddItemInput) {
        if (!product || !product.id) {
            throw new AddToCartProductNotFoundError(addToCartInput.productId);
        }
        if (product.type !== ItemTypes.SIMPLE) {
            throw new AddToCartInvalidProductTypeError(product.id);
        }
        if (!product.available) {
            throw new AddToCartProductIsNotAvailableError(product.id);
        }
        if (addToCartInput.qty >= MAX_VALUE_INTEGER_DATABASE) {
            throw new AddToCartInvalidQtyError(product.id);
        }
        if (product.quantity && product.stockConfig?.manageStock && !product.stockConfig.backorders) {
            if (addToCartInput.qty > product.quantity.salableQuantity) {
                throw new ProductSaleableQtyNotEnoughError(product.id);
            }
        }
    }

    checkProductExist(product: ProductGetOutput, productId: string) {
        if (!product || !product.id) {
            throw new AddToCartProductNotFoundError(productId);
        }
    }
}
