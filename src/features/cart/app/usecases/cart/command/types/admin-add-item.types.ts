import { AuthInput } from '@cbidigital/aqua/usecase';
import { CartAddItemInput, CartAddItemInputModel } from '../../../../../domain/aggregates';
import { Nullable } from '@heronjs/common';
import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export type AdminAddItemUseCaseInput = CartAddItemInput & {
    userId?: Nullable<string>;
};

export class AdminAddItemUseCaseInputModel extends CartAddItemInputModel {
    @Expose()
    @IsUUID()
    public readonly userId?: Nullable<string>;
}

export type AdminAddItemUseCaseOutput = void;

export type AdminAddItemUseCaseContext = {
    firstInput: AdminAddItemUseCaseInput;
    auth: AuthInput;
};

export type AdminAddItemUseCaseValidateInput = AdminAddItemUseCaseInput;
export type AdminAddItemUseCaseValidateOutput = AdminAddItemUseCaseInput;

export type AdminAddItemUseCaseProcessingInput = AdminAddItemUseCaseValidateOutput;
export type AdminAddItemUseCaseProcessingOutput = void;

export type AdminAddItemUseCaseMapInput = void;
export type AdminAddItemUseCaseMapOutput = void;
