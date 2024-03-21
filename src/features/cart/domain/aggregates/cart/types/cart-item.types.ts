import { Nullable } from '@heronjs/common';
import { Expose } from 'class-transformer';
import { IsBoolean, IsDefined, IsInt, IsNumber, IsUUID, Min } from 'class-validator';

// TYPE: create
export type CartItemCreateInput = {
    cartId: string;
    productId: string;
    qty: number;
    stockId?: Nullable<string>;
    customPrice?: number;
};

export class CartItemCreateInputModel implements CartItemCreateInput {
    @Expose()
    @IsDefined()
    @IsUUID()
    public readonly cartId!: string;

    @Expose()
    @IsDefined()
    @IsUUID()
    public readonly productId!: string;

    @Expose()
    @IsDefined()
    @IsInt()
    public readonly qty!: number;

    @Expose()
    @IsUUID()
    public readonly stockId!: Nullable<string>;

    @Expose()
    @IsNumber()
    @Min(0)
    public readonly customPrice?: number;
}

export type CartItemCreateOutput = void;

// TYPE: update
export type CartItemUpdateInput = {
    qty: number;
    isPlus: boolean;
    customPrice?: number;
};

export class CartItemUpdateInputModel implements CartItemUpdateInput {
    @Expose()
    @IsDefined()
    @IsInt()
    public readonly qty!: number;
    @Expose()
    @IsDefined()
    @IsBoolean()
    public readonly isPlus!: boolean;
    @Expose()
    @IsNumber()
    @Min(0)
    public readonly customPrice?: number;
}

export type CartItemUpdateOutput = void;

// TYPE: delete
export type CartItemDeleteInput = void;
export type CartItemDeleteOutput = void;
