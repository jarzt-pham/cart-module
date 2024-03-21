import { Inject, Provider, Scope } from '@heronjs/common';
import { UseCaseTokens } from '../../../../../../constants';
import {
    AdminAddListItemUseCaseInput,
    AdminAddListItemUseCaseOutput,
    AdminAddListItemUseCaseContext,
    AdminAddListItemUseCaseInputModel,
    AdminAddListItemUseCaseMapInput,
    AdminAddListItemUseCaseMapOutput,
    AdminAddListItemUseCaseProcessingInput,
    AdminAddListItemUseCaseProcessingOutput,
    AdminAddListItemUseCaseValidateInput,
    AdminAddListItemUseCaseValidateOutput,
} from './types';
import { IUseCase, UseCase, UseCasePipeMethod, ValidatorUtil } from '@cbidigital/aqua';
import { ICartUseCaseUtils } from './utils';

export type IAdminAddListItemUseCase = IUseCase<
    AdminAddListItemUseCaseInput,
    AdminAddListItemUseCaseOutput,
    AdminAddListItemUseCaseContext
>;

@Provider({ token: UseCaseTokens.ADMIN_ADD_LIST_ITEM, scope: Scope.REQUEST })
export class AdminAddListItemUseCase
    extends UseCase<
        AdminAddListItemUseCaseInput,
        AdminAddListItemUseCaseOutput,
        AdminAddListItemUseCaseContext
    >
    implements IAdminAddListItemUseCase
{
    constructor(@Inject(UseCaseTokens.CART_UTILS) protected _cartUseCaseUtils: ICartUseCaseUtils) {
        super();
        this.setMethods([this.validate, this.processing, this.map]);
    }

    validate: UseCasePipeMethod<AdminAddListItemUseCaseValidateInput, AdminAddListItemUseCaseValidateOutput> =
        async (input) => {
            return await ValidatorUtil.validatePlain<AdminAddListItemUseCaseInput>(
                AdminAddListItemUseCaseInputModel,
                input,
            );
        };

    processing: UseCasePipeMethod<
        AdminAddListItemUseCaseProcessingInput,
        AdminAddListItemUseCaseProcessingOutput
    > = async (input) => {
        const creatorId = this.context.auth.authId!;
        const userId = input.userId ?? creatorId;
        return this._cartUseCaseUtils.addListItem(userId, creatorId, input);
    };

    map: UseCasePipeMethod<AdminAddListItemUseCaseMapInput, AdminAddListItemUseCaseMapOutput> = async () => {
        return;
    };
}
