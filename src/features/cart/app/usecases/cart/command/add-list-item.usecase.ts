import { Inject, Provider, Scope } from '@heronjs/common';
import { UseCaseTokens } from '../../../../../../constants';
import {
    AddListItemUseCaseInput,
    AddListItemUseCaseOutput,
    AddListItemUseCaseContext,
    AddListItemUseCaseInputModel,
    AddListItemUseCaseMapInput,
    AddListItemUseCaseMapOutput,
    AddListItemUseCaseProcessingInput,
    AddListItemUseCaseProcessingOutput,
    AddListItemUseCaseValidateInput,
    AddListItemUseCaseValidateOutput,
} from './types';
import { IUseCase, UseCase, UseCasePipeMethod, ValidatorUtil } from '@cbidigital/aqua';
import { ICartUseCaseUtils } from './utils';

export type IAddListItemUseCase = IUseCase<
    AddListItemUseCaseInput,
    AddListItemUseCaseOutput,
    AddListItemUseCaseContext
>;

@Provider({ token: UseCaseTokens.ADD_LIST_ITEM, scope: Scope.REQUEST })
export class AddListItemUseCase
    extends UseCase<AddListItemUseCaseInput, AddListItemUseCaseOutput, AddListItemUseCaseContext>
    implements IAddListItemUseCase
{
    constructor(@Inject(UseCaseTokens.CART_UTILS) private readonly _cartUseCaseUtils: ICartUseCaseUtils) {
        super();
        this.setMethods([this.validate, this.processing, this.map]);
    }

    validate: UseCasePipeMethod<AddListItemUseCaseValidateInput, AddListItemUseCaseValidateOutput> = async (
        input,
    ) => {
        return await ValidatorUtil.validatePlain<AddListItemUseCaseInput>(
            AddListItemUseCaseInputModel,
            input,
        );
    };

    processing: UseCasePipeMethod<AddListItemUseCaseProcessingInput, AddListItemUseCaseProcessingOutput> =
        async (input) => {
            const userId = this.context.auth.authId!;
            return this._cartUseCaseUtils.addListItem(userId, null, input);
        };

    map: UseCasePipeMethod<AddListItemUseCaseMapInput, AddListItemUseCaseMapOutput> = async () => {
        return;
    };
}
