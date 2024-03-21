import { Expose } from 'class-transformer';
import { IsUUID, ArrayNotEmpty, IsString, IsDefined } from 'class-validator';
import { CartItemPreCheckoutDTO } from '../../../dtos';
import { Nullable } from '@heronjs/common';
import { PaymentPlatforms } from '@cbidigital/payment-module/features/payment/domain/enums';

export type CartPreCheckoutInput = {
    selectedItems?: string[];
    paymentMethodCode: Nullable<string>;
    couponsApplied: Nullable<string[]>;
};

export class CartPreCheckoutInputModel implements CartPreCheckoutInput {
    @Expose()
    @IsUUID('all', { each: true })
    @ArrayNotEmpty()
    public readonly selectedItems?: string[];

    @Expose()
    @IsString()
    public readonly paymentMethodCode!: Nullable<string>;

    @Expose()
    @IsUUID('all', { each: true })
    public readonly couponsApplied!: Nullable<string[]>;
}

export type CartPreCheckoutDetail = {
    items: CartItemPreCheckoutDTO[];
    targetId: Nullable<string>;
    subtotal: number;
    newOrderId: Nullable<string>;
};

export type CartPreCheckoutOutput = {
    cartDetails: CartPreCheckoutDetail[];
    grandTotal: number;
    totalItem: number;
    totalItemQty: number;
    checkoutPriceData: CheckoutPriceData;
};
export type CheckoutPriceData = {
    shippingFee: number;
    taxVAT: number;
};

export type CartCheckoutInput = {
    selectedItems?: string[];
    paymentMethodCode: string;
    couponsApplied: Nullable<string[]>;
    paymentPlatform: PaymentPlatforms;
};

export class CartCheckoutInputModel implements CartCheckoutInput {
    @Expose()
    @IsUUID('all', { each: true })
    @ArrayNotEmpty()
    public readonly selectedItems?: string[];

    @Expose()
    @IsDefined()
    @IsString()
    public readonly paymentMethodCode!: string;

    @Expose()
    @IsUUID('all', { each: true })
    public readonly couponsApplied!: Nullable<string[]>;

    @Expose()
    public readonly paymentPlatform!: PaymentPlatforms;
}
