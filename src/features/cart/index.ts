import { EavAttributeMapper, EavAttributeValueMapper } from '@cbidigital/aqua';
import { Module } from '@heronjs/common';

import { CartRepo } from './domain/repos';
import { CartAttributeDAO, CartAttributeValueDAO, CartDAO, CartItemDAO } from './infra/databases';
import { CartQueryUtil } from './infra/databases';
import { CartMapper } from './domain/utils/objects';
import { CartItemMapper } from './domain/utils/objects/mappers/cart-item.mapper';
import { ProductValidator } from './domain/utils/validator/product';
import { ProductProvider } from './domain/providers/product';
import { OrderProvider } from './domain/providers/order';
import { PaymentProvider } from './domain/providers/payment';
import { PromotionProvider } from './domain/providers/promotion';

@Module({
    providers: [
        // Query util
        CartQueryUtil,

        // Mappers
        EavAttributeMapper,
        EavAttributeValueMapper,
        CartMapper,
        CartItemMapper,

        // Validator
        ProductValidator,

        // Internal
        ProductProvider,
        OrderProvider,
        PaymentProvider,
        PromotionProvider,
        // DAOs
        CartDAO,
        CartAttributeDAO,
        CartAttributeValueDAO,
        CartItemDAO,

        // Repos
        CartRepo,
    ],
})
export class CartModule {}
