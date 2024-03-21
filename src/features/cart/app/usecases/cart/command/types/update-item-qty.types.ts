import { AuthInput } from '@cbidigital/aqua/usecase';
import {
    CartItem,
    CartUpdateItemQtyInput,
    CartUpdateItemQtyInputModel,
} from '../../../../../domain/aggregates';

export type UpdateItemQtyUseCaseInput = CartUpdateItemQtyInput;

export class UpdateItemQtyUseCaseInputModel extends CartUpdateItemQtyInputModel {}

export type UpdateItemQtyUseCaseOutput = void;

export type UpdateItemQtyUseCaseContext = {
    firstInput: UpdateItemQtyUseCaseInput;
    auth: AuthInput;
};

export type UpdateItemQtyUseCaseValidateInput = UpdateItemQtyUseCaseInput;
export type UpdateItemQtyUseCaseValidateOutput = {
    qty: number;
    cartItem: CartItem;
};

export type UpdateItemQtyUseCaseProcessingInput = UpdateItemQtyUseCaseValidateOutput;
export type UpdateItemQtyUseCaseProcessingOutput = void;

export type UpdateItemQtyUseCaseMapInput = void;
export type UpdateItemQtyUseCaseMapOutput = void;
