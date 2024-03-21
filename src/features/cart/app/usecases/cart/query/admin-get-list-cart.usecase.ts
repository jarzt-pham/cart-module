import { UseCasePipeMethod } from '@cbidigital/aqua';
import { Provider, Scope } from '@heronjs/common';
import { UseCaseTokens } from '../../../../../../constants';
import { GetListCartUseCaseProcessingInput, GetListCartUseCaseProcessingOutput } from './types';
import { GetListCartUseCase } from './get-list-cart.usecase';

@Provider({ token: UseCaseTokens.ADMIN_GET_LIST_CART, scope: Scope.REQUEST })
export class AdminGetListCartUseCase extends GetListCartUseCase {
    override processing: UseCasePipeMethod<
        GetListCartUseCaseProcessingInput,
        GetListCartUseCaseProcessingOutput
    > = async () => {
        return this._cartDAO.find(
            {
                filter: {
                    creatorId: { eq: this.context.auth.authId },
                    enabled: { eq: true },
                },
            },
            { resolve: ['attributeValues', 'items'], useMaster: this.context.auth.isAdmin },
        );
    };
}
