export const CartTokens = Object.freeze({
    CART_QUERY_UTIL: 'cart-module.query-util',
    PRODUCT_VALIDATOR: 'cart-module.product-validator',
});

export const DAOTokens = Object.freeze({
    CART: 'cart-module.cart.dao',
    CART_ITEM: 'cart-module.cart-items.dao',
    CART_ATTRIBUTE: 'cart-module.attribute.dao',
    CART_ATTRIBUTE_VALUE: 'cart-module.attribute-value.dao',
});

export const RepoTokens = Object.freeze({
    CART: 'cart-module.repo',
    CART_ITEM: 'cart-module.repo',
});

export const MapperTokens = Object.freeze({
    CART: 'cart-module.cart.mapper',
    CART_ITEM: 'cart-module.mapper',
});

export const UseCaseTokens = Object.freeze({
    UPDATE_CART: 'cart-module.update-cart.usecase',
    DELETE_CART: 'cart-module.delete-cart.usecase',
    GET_LIST_CART: 'cart-module.get-list-cart.usecase',

    ADD_ITEM: 'cart-module.add-item.usecase',
    ADD_LIST_ITEM: 'cart-module.add-list-item.usecase',
    REMOVE_ITEM: 'cart-module.remove-item.usecase',
    REMOVE_NOT_AVAILABLE_ITEMS: 'cart-module.remove-not-available-items.usecase',
    UPDATE_ITEM_QTY: 'cart-module.update-item-qty.usecase',
    GET_ITEM_BY_PRODUCT_ID: 'cart-module.get-item-by-product-id.usecase',

    CREATE_CART_ATTRIBUTE: 'cart-module.create-cart-attribute.usecase',
    UPDATE_CART_ATTRIBUTE: 'cart-module.update-cart-attribute.usecase',
    DELETE_CART_ATTRIBUTE: 'cart-module.delete-cart-attribute.usecase',
    GET_LIST_CART_ATTRIBUTE: 'cart-module.get-list-cart-attribute.usecase',
    GET_CART_ATTRIBUTE: 'cart-module.get-cart-attribute.usecase',

    PRE_CHECKOUT: 'cart-module.pre-checkout.usecase',
    PLACE_ORDER: 'cart-module.place-order.usecase',

    ADMIN_DELETE_CART: 'cart-module.admin-delete-cart.usecase',
    ADMIN_GET_LIST_CART: 'cart-module.admin-get-list-cart.usecase',

    ADMIN_ADD_ITEM: 'cart-module.admin-add-item.usecase',
    ADMIN_UPDATE_ITEM: 'cart-module.admin-add-item.usecase',
    ADMIN_ADD_LIST_ITEM: 'cart-module.admin-add-list-item.usecase',
    ADMIN_REMOVE_ITEM: 'cart-module.admin-remove-item.usecase',
    ADMIN_REMOVE_NOT_AVAILABLE_ITEMS: 'cart-module.admin-remove-not-available-items.usecase',
    ADMIN_UPDATE_ITEM_QTY: 'cart-module.admin-update-item-qty.usecase',

    CART_UTILS: 'cart-module.cart-usecase.utils',
});
export const InjectTokens = Object.freeze({
    PRODUCT_CONNECTOR: 'PRODUCT_CONNECTOR',
    ORDER_CONNECTOR: 'ORDER_CONNECTOR',
    PAYMENT_CONNECTOR: 'PAYMENT_CONNECTOR',
    PROMOTION_CONNECTOR: 'COUPON_CONNECTOR',
});
export const ProviderTokens = Object.freeze({
    PRODUCT_PROVIDER: 'cart-module.product-provider',
    ORDER_PROVIDER: 'cart-module.order-provider',
    PAYMENT_PROVIDER: 'cart-module.payment-provider',
    PROMOTION_PROVIDER: 'cart-module.promotion-provider',
});
