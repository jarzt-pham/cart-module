import { CartDTO } from '../../../../../domain/dtos';
import { AuthInput } from '@cbidigital/aqua';

export type GetListCartUseCaseInput = void;
export type GetListCartUseCaseOutput = CartDTO[];

export type GetListCartUseCaseContext = {
    firstInput: GetListCartUseCaseInput;
    auth: AuthInput;
};

export type GetListCartUseCaseValidateInput = GetListCartUseCaseInput;
export type GetListCartUseCaseValidateOutput = GetListCartUseCaseInput;

export type GetListCartUseCaseProcessingInput = GetListCartUseCaseValidateOutput;
export type GetListCartUseCaseProcessingOutput = Partial<CartDTO>[];

export type GetListCartUseCaseMapInput = GetListCartUseCaseProcessingOutput;
export type GetListCartUseCaseMapOutput = Partial<CartDTO>[];
