import { CartItemDTO } from '../../../../../domain/dtos';
import { AuthInput } from '@cbidigital/aqua';
import { Nullable, Optional } from '@heronjs/common';
import { Expose } from 'class-transformer';
import { IsDefined, IsUUID } from 'class-validator';

export type GetItemByProductIdUseCaseInput = {
    productId: string;
    stockId?: Nullable<string>;
};

export class GetItemByProductIdUseCaseInputModel implements GetItemByProductIdUseCaseInput {
    @Expose()
    @IsDefined()
    @IsUUID()
    public readonly productId!: string;
    @Expose()
    @IsUUID()
    public readonly stockId?: string;
}

export type GetItemByProductIdUseCaseOutput = Optional<CartItemDTO>;

export type GetItemByProductIdUseCaseContext = {
    firstInput: GetItemByProductIdUseCaseInput;
    auth: AuthInput;
};

export type GetItemByProductIdUseCaseValidateInput = GetItemByProductIdUseCaseInput;
export type GetItemByProductIdUseCaseValidateOutput = GetItemByProductIdUseCaseInput;

export type GetItemByProductIdUseCaseProcessingInput = GetItemByProductIdUseCaseValidateOutput;
export type GetItemByProductIdUseCaseProcessingOutput = GetItemByProductIdUseCaseOutput;

export type GetItemByProductIdUseCaseMapInput = GetItemByProductIdUseCaseProcessingOutput;
export type GetItemByProductIdUseCaseMapOutput = GetItemByProductIdUseCaseOutput;
