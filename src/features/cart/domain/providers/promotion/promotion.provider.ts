import { IModuleConnector } from '@cbidigital/aqua/module';
import { Provider, Scope } from '@cbidigital/heron-common';
import { InjectTokens, ProviderTokens } from '../../../../../constants';
import { ICouponConnectorService } from '@cbidigital/promotion-module/connectors/coupon';
import {
    UpdateCouponUsageInput,
    VerifyCouponInput,
} from '@cbidigital/promotion-module/features/salesrule/domain/service/coupon';
import { CouponDTO } from '@cbidigital/promotion-module/features/salesrule/domain/dtos';
import { Autowired } from '@heronjs/common';

export interface IPromotionProvider {
    verifyCoupon(input: VerifyCouponInput): Promise<CouponDTO>;

    updateCouponUsage(input: UpdateCouponUsageInput): Promise<CouponDTO>;
}

@Provider({ token: ProviderTokens.PROMOTION_PROVIDER, scope: Scope.SINGLETON })
export class PromotionProvider implements IPromotionProvider {
    constructor(
        @Autowired(InjectTokens.PROMOTION_CONNECTOR)
        protected _promotionConnector: IModuleConnector<ICouponConnectorService>,
    ) {
        // if (!this._promotionConnector) throw new NotSupportedError('Please inject promotion connector');
    }

    // todo: promotion module verify and updateCouponUsage by code / id
    async verifyCoupon(input: VerifyCouponInput): Promise<CouponDTO> {
        return await this._promotionConnector.service.verifyCoupon(input);
    }

    async updateCouponUsage(input: UpdateCouponUsageInput): Promise<CouponDTO> {
        return await this._promotionConnector.service.updateCouponUsage(input);
    }
}
