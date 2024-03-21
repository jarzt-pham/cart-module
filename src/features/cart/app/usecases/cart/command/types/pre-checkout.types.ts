import { AuthInput } from '@cbidigital/aqua/usecase';
import {
    CartPreCheckoutInput,
    CartPreCheckoutInputModel,
    CartPreCheckoutOutput,
} from '../../../../../domain/aggregates';

export type PreCheckoutUseCaseInput = CartPreCheckoutInput;

export class PreCheckoutUseCaseInputModel extends CartPreCheckoutInputModel {}

export type PreCheckoutUseCaseOutput = CartPreCheckoutOutput;

export type PreCheckoutUseCaseContext = {
    firstInput: PreCheckoutUseCaseInput;
    auth: AuthInput;
};

export type PreCheckoutUseCaseValidateInput = PreCheckoutUseCaseInput;
export type PreCheckoutUseCaseValidateOutput = PreCheckoutUseCaseInput;

export type PreCheckoutUseCaseProcessingInput = PreCheckoutUseCaseValidateOutput;
export type PreCheckoutUseCaseProcessingOutput = CartPreCheckoutOutput;

export type PreCheckoutUseCaseMapInput = PreCheckoutUseCaseProcessingOutput;
export type PreCheckoutUseCaseMapOutput = CartPreCheckoutOutput;
