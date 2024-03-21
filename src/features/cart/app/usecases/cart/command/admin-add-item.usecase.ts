import { Inject, Provider, Scope } from '@heronjs/common';
import { UseCaseTokens } from '../../../../../../constants';
import {
    AdminAddItemUseCaseInput,
    AdminAddItemUseCaseOutput,
    AdminAddItemUseCaseContext,
    AdminAddItemUseCaseInputModel,
    AdminAddItemUseCaseMapInput,
    AdminAddItemUseCaseMapOutput,
    AdminAddItemUseCaseProcessingInput,
    AdminAddItemUseCaseProcessingOutput,
    AdminAddItemUseCaseValidateInput,
    AdminAddItemUseCaseValidateOutput,
} from './types';
import { IUseCase, UseCase, UseCasePipeMethod, ValidatorUtil } from '@cbidigital/aqua';
import { ICartUseCaseUtils } from './utils';

export type IAdminAddItemUseCase = IUseCase<
    AdminAddItemUseCaseInput,
    AdminAddItemUseCaseOutput,
    AdminAddItemUseCaseContext
>;

@Provider({ token: UseCaseTokens.ADMIN_ADD_ITEM, scope: Scope.REQUEST })
export class AdminAddItemUseCase
    extends UseCase<AdminAddItemUseCaseInput, AdminAddItemUseCaseOutput, AdminAddItemUseCaseContext>
    implements IAdminAddItemUseCase
{
    constructor(@Inject(UseCaseTokens.CART_UTILS) protected _cartUseCaseUtils: ICartUseCaseUtils) {
        super();
        this.setMethods([this.validate, this.processing, this.map]);
    }

    validate: UseCasePipeMethod<AdminAddItemUseCaseValidateInput, AdminAddItemUseCaseValidateOutput> = async (
        input,
    ) => {
        return await ValidatorUtil.validatePlain<AdminAddItemUseCaseInput>(
            AdminAddItemUseCaseInputModel,
            input,
        );
    };

    processing: UseCasePipeMethod<AdminAddItemUseCaseProcessingInput, AdminAddItemUseCaseProcessingOutput> =
        async (input) => {
            const creatorId = this.context.auth.authId!;
            const userId = input.userId ?? creatorId;
            return this._cartUseCaseUtils.addItem(userId, creatorId, input);
        };

    map: UseCasePipeMethod<AdminAddItemUseCaseMapInput, AdminAddItemUseCaseMapOutput> = async () => {
        return;
    };
}
