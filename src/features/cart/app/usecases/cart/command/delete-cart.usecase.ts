import { Inject, Provider, Scope } from '@heronjs/common';
import { RepoTokens, UseCaseTokens } from '../../../../../../constants';
import { ICartRepo } from '../../../../domain/repos';
import {
    DeleteCartUseCaseInput,
    DeleteCartUseCaseOutput,
    DeleteCartUseCaseContext,
    DeleteCartUseCaseInputModel,
    DeleteCartUseCaseMapInput,
    DeleteCartUseCaseMapOutput,
    DeleteCartUseCaseProcessingInput,
    DeleteCartUseCaseProcessingOutput,
    DeleteCartUseCaseValidateInput,
    DeleteCartUseCaseValidateOutput,
} from './types';
import { IUseCase, UseCase, UseCasePipeMethod, ValidatorUtil } from '@cbidigital/aqua';

export type IDeleteCartUseCase = IUseCase<
    DeleteCartUseCaseInput,
    DeleteCartUseCaseOutput,
    DeleteCartUseCaseContext
>;

@Provider({ token: UseCaseTokens.DELETE_CART, scope: Scope.REQUEST })
export class DeleteCartUseCase
    extends UseCase<DeleteCartUseCaseInput, DeleteCartUseCaseOutput, DeleteCartUseCaseContext>
    implements IDeleteCartUseCase
{
    constructor(@Inject(RepoTokens.CART) protected readonly _repo: ICartRepo) {
        super();
        this.setMethods([this.validate, this.processing, this.map]);
    }

    validate: UseCasePipeMethod<DeleteCartUseCaseValidateInput, DeleteCartUseCaseValidateOutput> = async (
        input,
    ) => {
        return await ValidatorUtil.validatePlain<DeleteCartUseCaseInput>(DeleteCartUseCaseInputModel, input);
    };

    processing: UseCasePipeMethod<DeleteCartUseCaseProcessingInput, DeleteCartUseCaseProcessingOutput> =
        async (input) => {
            const userId = this.context.auth.authId!;
            await this._repo.delete(input.id, userId);
            return;
        };

    map: UseCasePipeMethod<DeleteCartUseCaseMapInput, DeleteCartUseCaseMapOutput> = async () => {
        return;
    };
}
