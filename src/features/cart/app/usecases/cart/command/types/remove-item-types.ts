import { AuthInput } from '@cbidigital/aqua/usecase';
import { CartRemoveItemInput, CartRemoveItemInputModel } from '../../../../../domain/aggregates';

export type RemoveItemUseCaseInput = CartRemoveItemInput;

export class RemoveItemUseCaseInputModel extends CartRemoveItemInputModel {}

export type RemoveItemUseCaseOutput = void;

export type RemoveItemUseCaseContext = {
    firstInput: RemoveItemUseCaseInput;
    auth: AuthInput;
};

export type RemoveItemUseCaseValidateInput = RemoveItemUseCaseInput;
export type RemoveItemUseCaseValidateOutput = RemoveItemUseCaseInput;

export type RemoveItemUseCaseProcessingInput = RemoveItemUseCaseValidateOutput;
export type RemoveItemUseCaseProcessingOutput = void;

export type RemoveItemUseCaseMapInput = void;
export type RemoveItemUseCaseMapOutput = void;
