import { Inject, Provider, Scope } from '@heronjs/common';
import { UseCaseTokens } from '../../../../../../constants';
import {
    AddItemUseCaseInput,
    AddItemUseCaseOutput,
    AddItemUseCaseContext,
    AddItemUseCaseInputModel,
    AddItemUseCaseMapInput,
    AddItemUseCaseMapOutput,
    AddItemUseCaseProcessingInput,
    AddItemUseCaseProcessingOutput,
    AddItemUseCaseValidateInput,
    AddItemUseCaseValidateOutput,
} from './types';
import { IUseCase, UseCase, UseCasePipeMethod, ValidatorUtil } from '@cbidigital/aqua';
import { ICartUseCaseUtils } from './utils';

export type IAddItemUseCase = IUseCase<AddItemUseCaseInput, AddItemUseCaseOutput, AddItemUseCaseContext>;

@Provider({ token: UseCaseTokens.ADD_ITEM, scope: Scope.REQUEST })
export class AddItemUseCase
    extends UseCase<AddItemUseCaseInput, AddItemUseCaseOutput, AddItemUseCaseContext>
    implements IAddItemUseCase
{
    constructor(@Inject(UseCaseTokens.CART_UTILS) private readonly _cartUseCaseUtils: ICartUseCaseUtils) {
        super();
        this.setMethods([this.validate, this.processing, this.map]);
    }

    validate: UseCasePipeMethod<AddItemUseCaseValidateInput, AddItemUseCaseValidateOutput> = async (
        input,
    ) => {
        return await ValidatorUtil.validatePlain<AddItemUseCaseInput>(AddItemUseCaseInputModel, input);
    };

    processing: UseCasePipeMethod<AddItemUseCaseProcessingInput, AddItemUseCaseProcessingOutput> = async (
        input,
    ) => {
        const userId = this.context.auth.authId!;
        return this._cartUseCaseUtils.addItem(userId, null, input);
    };

    map: UseCasePipeMethod<AddItemUseCaseMapInput, AddItemUseCaseMapOutput> = async () => {
        return;
    };
}
