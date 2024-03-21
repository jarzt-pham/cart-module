import { DeleteCartUseCase } from './delete-cart.usecase';
import { UseCaseTokens } from '../../../../../../constants';
import { Provider, Scope } from '@heronjs/common';
import { UseCasePipeMethod } from '@cbidigital/aqua';
import { DeleteCartUseCaseProcessingInput, DeleteCartUseCaseProcessingOutput } from './types';

@Provider({ token: UseCaseTokens.ADMIN_DELETE_CART, scope: Scope.REQUEST })
export class AdminDeleteCartUseCase extends DeleteCartUseCase {
    override processing: UseCasePipeMethod<
        DeleteCartUseCaseProcessingInput,
        DeleteCartUseCaseProcessingOutput
    > = async (input) => {
        const userId = this.context.auth.authId!;
        await this._repo.delete(input.id, userId, undefined, true);
        return;
    };
}
