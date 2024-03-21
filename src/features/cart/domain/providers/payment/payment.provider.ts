import { IModuleConnector } from '@cbidigital/aqua/module';
import { Provider, Scope } from '@cbidigital/heron-common';
import { lastValueFrom } from 'rxjs';
import { InjectTokens, ProviderTokens } from '../../../../../constants';
import { IPaymentConnectorService } from '@cbidigital/payment-module/connectors';
import { PaymentPayOutput } from '@cbidigital/payment-module/features/payment/app/useCases';
import { PaymentPlatforms } from '@cbidigital/payment-module/features/payment/domain/enums';
import { AuthInput } from '@cbidigital/aqua/usecase/usecase';
import { Autowired } from '@heronjs/common';

export type PaymentPayOrdersInput = {
    methodCode: string;
    orderIds: string[];
    sourceType: string;
    currency: string;
    amount: number;
    paymentPlatform: string;
    auth: AuthInput;
};

export interface IPaymentProvider {
    payOrders(input: PaymentPayOrdersInput): Promise<PaymentPayOutput>;
}

@Provider({ token: ProviderTokens.PAYMENT_PROVIDER, scope: Scope.SINGLETON })
export class PaymentProvider implements IPaymentProvider {
    constructor(
        @Autowired(InjectTokens.PAYMENT_CONNECTOR)
        protected _paymentConnector: IModuleConnector<IPaymentConnectorService>,
    ) {
        // if (!this._paymentConnector) throw new NotSupportedError('Please inject payment connector');
    }

    async payOrders(input: PaymentPayOrdersInput): Promise<PaymentPayOutput> {
        return await lastValueFrom(
            this._paymentConnector.service.pay({
                input: {
                    userId: input.auth.authId!,
                    methodCode: input.methodCode,
                    sources: input.orderIds.map((o) => {
                        return {
                            sourceId: o,
                            sourceType: input.sourceType,
                        };
                    }),
                    amount: input.amount,
                    currency: input.currency,
                    platform: input.paymentPlatform as PaymentPlatforms,
                },
                auth: input.auth,
            }),
        );
    }
}
