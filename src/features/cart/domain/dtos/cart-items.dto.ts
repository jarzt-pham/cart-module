import { Nullable } from '@heronjs/common';
import { ProductGetOutput } from '@cbidigital/inventory-module/features/product/app/useCases';

export type CartItemDTO = {
    id: string;
    cartId: string;
    product?: ProductGetOutput;
    productId: string;
    qty: number;
    stockId?: Nullable<string>;
    createdAt: Date;
    updatedAt: Nullable<Date>;
    customPrice?: number;
};
export type CartItemPreCheckoutDTO = {
    id: string;
    cartId: string;
    product: ProductGetOutput;
    productId: string;
    qty: number;
    stockId?: Nullable<string>;
    createdAt: Date;
    updatedAt: Nullable<Date>;
};
