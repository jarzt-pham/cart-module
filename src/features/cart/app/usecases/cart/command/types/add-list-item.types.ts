import { AuthInput } from '@cbidigital/aqua/usecase';
import { CartAddListItemInput, CartAddListItemInputModel } from '../../../../../domain/aggregates';

export type AddListItemUseCaseInput = CartAddListItemInput;

export class AddListItemUseCaseInputModel extends CartAddListItemInputModel {}

export type AddListItemUseCaseOutput = void;

export type AddListItemUseCaseContext = {
    firstInput: AddListItemUseCaseInput;
    auth: AuthInput;
};

export type AddListItemUseCaseValidateInput = AddListItemUseCaseInput;
export type AddListItemUseCaseValidateOutput = AddListItemUseCaseInput;

export type AddListItemUseCaseProcessingInput = AddListItemUseCaseValidateOutput;
export type AddListItemUseCaseProcessingOutput = void;

export type AddListItemUseCaseMapInput = void;
export type AddListItemUseCaseMapOutput = void;
