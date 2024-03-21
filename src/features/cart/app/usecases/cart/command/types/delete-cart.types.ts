import { AuthInput } from '@cbidigital/aqua/usecase';
import { CartDeleteInput, CartDeleteInputModel } from '../../../../../domain/aggregates';

export type DeleteCartUseCaseInput = CartDeleteInput;

export class DeleteCartUseCaseInputModel extends CartDeleteInputModel {}

export type DeleteCartUseCaseOutput = void;

export type DeleteCartUseCaseContext = {
    firstInput: DeleteCartUseCaseInput;
    auth: AuthInput;
};

export type DeleteCartUseCaseValidateInput = DeleteCartUseCaseInput;
export type DeleteCartUseCaseValidateOutput = DeleteCartUseCaseInput;

export type DeleteCartUseCaseProcessingInput = DeleteCartUseCaseValidateOutput;
export type DeleteCartUseCaseProcessingOutput = void;

export type DeleteCartUseCaseMapInput = void;
export type DeleteCartUseCaseMapOutput = void;
