import { AuthInput } from '@cbidigital/aqua/usecase';
import { CartAddItemInput, CartAddItemInputModel } from '../../../../../domain/aggregates';

export type AddItemUseCaseInput = CartAddItemInput;

export class AddItemUseCaseInputModel extends CartAddItemInputModel {}

export type AddItemUseCaseOutput = void;

export type AddItemUseCaseContext = {
    firstInput: AddItemUseCaseInput;
    auth: AuthInput;
};

export type AddItemUseCaseValidateInput = AddItemUseCaseInput;
export type AddItemUseCaseValidateOutput = AddItemUseCaseInput;

export type AddItemUseCaseProcessingInput = AddItemUseCaseValidateOutput;
export type AddItemUseCaseProcessingOutput = void;

export type AddItemUseCaseMapInput = void;
export type AddItemUseCaseMapOutput = void;
