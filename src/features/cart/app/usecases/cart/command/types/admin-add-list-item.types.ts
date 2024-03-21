import { AuthInput } from '@cbidigital/aqua/usecase';
import { CartAddListItemInput, CartAddListItemInputModel } from '../../../../../domain/aggregates';
import { Nullable } from '@heronjs/common';
import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export type AdminAddListItemUseCaseInput = CartAddListItemInput & {
    userId?: Nullable<string>;
};

export class AdminAddListItemUseCaseInputModel extends CartAddListItemInputModel {
    @Expose()
    @IsUUID()
    public readonly userId?: Nullable<string>;
}

export type AdminAddListItemUseCaseOutput = void;

export type AdminAddListItemUseCaseContext = {
    firstInput: AdminAddListItemUseCaseInput;
    auth: AuthInput;
};

export type AdminAddListItemUseCaseValidateInput = AdminAddListItemUseCaseInput;
export type AdminAddListItemUseCaseValidateOutput = AdminAddListItemUseCaseInput;

export type AdminAddListItemUseCaseProcessingInput = AdminAddListItemUseCaseValidateOutput;
export type AdminAddListItemUseCaseProcessingOutput = void;

export type AdminAddListItemUseCaseMapInput = void;
export type AdminAddListItemUseCaseMapOutput = void;
