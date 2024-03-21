import { AuthInput } from '@cbidigital/aqua/usecase';
import { CartItem, CartUpdateItemInput, CartUpdateItemInputModel } from '../../../../../domain/aggregates';
import { Nullable } from '@heronjs/common';
import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export type AdminUpdateItemUseCaseInput = CartUpdateItemInput & {
    userId?: Nullable<string>;
};

export class AdminUpdateItemUseCaseInputModel
    extends CartUpdateItemInputModel
    implements AdminUpdateItemUseCaseInput
{
    @Expose()
    @IsUUID()
    public readonly userId?: Nullable<string>;
}

export type AdminUpdateItemUseCaseOutput = void;

export type AdminUpdateItemUseCaseContext = {
    firstInput: AdminUpdateItemUseCaseInput;
    auth: AuthInput;
};

export type AdminUpdateItemUseCaseValidateInput = AdminUpdateItemUseCaseInput;
export type AdminUpdateItemUseCaseValidateOutput = {
    cartItem: CartItem;
    input: AdminUpdateItemUseCaseInput;
};

export type AdminUpdateItemUseCaseProcessingInput = AdminUpdateItemUseCaseValidateOutput;
export type AdminUpdateItemUseCaseProcessingOutput = void;

export type AdminUpdateItemUseCaseMapInput = void;
export type AdminUpdateItemUseCaseMapOutput = void;
