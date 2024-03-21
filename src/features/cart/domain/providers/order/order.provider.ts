import { IModuleConnector } from '@cbidigital/aqua/module';
import { Provider, Scope } from '@cbidigital/heron-common';
import { InjectTokens, ProviderTokens } from '../../../../../constants';
import { IOrderConnectorService } from '@cbidigital/order-module/connectors';
import { Autowired } from '@heronjs/common';
import {
    CreateOrderUseCaseInput,
    CreateOrderUseCaseOutput,
} from '@cbidigital/order-module/features/order/app/usecases/order/command/types';

export interface IOrderProvider {
    create(input: CreateOrderUseCaseInput): Promise<CreateOrderUseCaseOutput>;
}

@Provider({ token: ProviderTokens.ORDER_PROVIDER, scope: Scope.SINGLETON })
export class OrderProvider implements IOrderProvider {
    constructor(
        @Autowired(InjectTokens.ORDER_CONNECTOR)
        protected _orderConnector: IModuleConnector<IOrderConnectorService>,
    ) {
        // if (!this._orderConnector) throw new NotSupportedError('Please inject order connector');
    }

    async create(input: CreateOrderUseCaseInput): Promise<CreateOrderUseCaseOutput> {
        return await this._orderConnector.service.create(input);
    }
}
