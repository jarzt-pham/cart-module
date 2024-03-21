import { ModuleConnectionTypes } from '@cbidigital/aqua/module';

export const ModuleConnectorConfig = {
    type: process.env.CART_MODULE_CONNECTION_TYPE as ModuleConnectionTypes,
    restfulConfig: {
        host: process.env.CART_MODULE_HOST,
        pathname: {
            checkout: process.env.CART_MODULE_PATHNAME_CHECKOUT || '/internal/carts/checkout',
        },
        secretKey: process.env.SECRET_KEY_INTERNAL_API_CART,
    },
};
