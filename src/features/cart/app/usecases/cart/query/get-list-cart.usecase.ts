import { IUseCase, UseCase, UseCasePipeMethod } from '@cbidigital/aqua';
import { Inject, Provider, Scope } from '@heronjs/common';
import { DAOTokens, UseCaseTokens } from '../../../../../../constants';
import { ICartDAO } from '../../../../infra/databases';
import {
    GetListCartUseCaseContext,
    GetListCartUseCaseInput,
    GetListCartUseCaseMapInput,
    GetListCartUseCaseMapOutput,
    GetListCartUseCaseOutput,
    GetListCartUseCaseProcessingInput,
    GetListCartUseCaseProcessingOutput,
    GetListCartUseCaseValidateInput,
    GetListCartUseCaseValidateOutput,
} from './types';

export type IGetListCartUseCase = IUseCase<
    GetListCartUseCaseInput,
    GetListCartUseCaseOutput,
    GetListCartUseCaseContext
>;

@Provider({ token: UseCaseTokens.GET_LIST_CART, scope: Scope.REQUEST })
export class GetListCartUseCase
    extends UseCase<GetListCartUseCaseInput, GetListCartUseCaseOutput, GetListCartUseCaseContext>
    implements IGetListCartUseCase
{
    constructor(@Inject(DAOTokens.CART) protected readonly _cartDAO: ICartDAO) {
        super();
        this.setMethods([this.validate, this.processing, this.map]);
    }

    validate: UseCasePipeMethod<GetListCartUseCaseValidateInput, GetListCartUseCaseValidateOutput> = async (
        input,
    ) => {
        return input;
    };

    processing: UseCasePipeMethod<GetListCartUseCaseProcessingInput, GetListCartUseCaseProcessingOutput> =
        async () => {
            return this._cartDAO.find(
                {
                    filter: {
                        userId: { eq: this.context.auth.authId },
                        enabled: { eq: true },
                    },
                },
                {
                    resolve: ['attributeValues', 'items'],
                    useMaster: this.context.auth.isAdmin,
                },
            );
        };

    map: UseCasePipeMethod<GetListCartUseCaseMapInput, GetListCartUseCaseMapOutput> = async (input) => {
        return input;
    };
}
