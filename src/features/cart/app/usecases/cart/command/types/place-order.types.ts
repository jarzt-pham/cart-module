import { AuthInput } from '@cbidigital/aqua/usecase';
import { CartCheckoutInput, CartCheckoutInputModel } from '../../../../../domain/aggregates';
import { Expose } from 'class-transformer';
import { IsUUID, IsObject } from 'class-validator';
import { OrderDTO } from '@cbidigital/order-module/features/order/domain/dtos';

export type PlaceOrderUseCaseInput = CartCheckoutInput & {
    userId?: string;
    userTargetId?: string;
    orderAttributes?: object;
};

export class PlaceOrderUseCaseInputModel extends CartCheckoutInputModel {
    @Expose()
    @IsUUID()
    public readonly userId?: string;
    @Expose()
    @IsUUID()
    public readonly userTargetId?: string;
    @Expose()
    @IsObject()
    public readonly orderAttributes?: object;
}

export type PlaceOrderUseCaseOutput = void;

export type PlaceOrderUseCaseContext = {
    firstInput: PlaceOrderUseCaseInput;
    auth: AuthInput;
};

export type PlaceOrderUseCaseValidateInput = PlaceOrderUseCaseInput;
export type PlaceOrderUseCaseValidateOutput = PlaceOrderUseCaseInput;

export type PlaceOrderUseCaseProcessingInput = PlaceOrderUseCaseValidateOutput;
export type PlaceOrderUseCaseProcessingOutput = {
    orders: OrderDTO[];
    payment: any;
};

export type PlaceOrderUseCaseMapInput = void;
export type PlaceOrderUseCaseMapOutput = void;
