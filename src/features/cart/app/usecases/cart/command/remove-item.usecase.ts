import { Inject, Provider, Scope } from '@heronjs/common';
import { RepoTokens, UseCaseTokens } from '../../../../../../constants';
import { ICartRepo } from '../../../../domain/repos';
import {
    RemoveItemUseCaseInput,
    RemoveItemUseCaseOutput,
    RemoveItemUseCaseContext,
    RemoveItemUseCaseInputModel,
    RemoveItemUseCaseMapInput,
    RemoveItemUseCaseMapOutput,
    RemoveItemUseCaseProcessingInput,
    RemoveItemUseCaseProcessingOutput,
    RemoveItemUseCaseValidateInput,
    RemoveItemUseCaseValidateOutput,
} from './types';
import { IUseCase, UseCase, UseCasePipeMethod, ValidatorUtil } from '@cbidigital/aqua';

export type IRemoveItemUseCase = IUseCase<
    RemoveItemUseCaseInput,
    RemoveItemUseCaseOutput,
    RemoveItemUseCaseContext
>;

@Provider({ token: UseCaseTokens.REMOVE_ITEM, scope: Scope.REQUEST })
export class RemoveItemUseCase
    extends UseCase<RemoveItemUseCaseInput, RemoveItemUseCaseOutput, RemoveItemUseCaseContext>
    implements IRemoveItemUseCase
{
    constructor(@Inject(RepoTokens.CART) protected readonly _repo: ICartRepo) {
        super();
        this.setMethods([this.validate, this.processing, this.map]);
    }

    validate: UseCasePipeMethod<RemoveItemUseCaseValidateInput, RemoveItemUseCaseValidateOutput> = async (
        input,
    ) => {
        return await ValidatorUtil.validatePlain<RemoveItemUseCaseInput>(RemoveItemUseCaseInputModel, input);
    };

    processing: UseCasePipeMethod<RemoveItemUseCaseProcessingInput, RemoveItemUseCaseProcessingOutput> =
        async (input) => {
            const userId = this.context.auth.authId!;
            const cartItem = await this._repo.getItemById(input.itemId, true);
            const cart = await this._repo.getById(cartItem.cartId, userId);
            if (cart) await this._repo.deleteItem(cartItem.id, cartItem);
            return;
        };

    map: UseCasePipeMethod<RemoveItemUseCaseMapInput, RemoveItemUseCaseMapOutput> = async () => {
        return;
    };
}
