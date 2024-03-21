import { Nullable } from '@heronjs/common';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsInt, IsNumber, IsUUID, Min, ValidateNested } from 'class-validator';
import { CreateAttributesValuesInput, UpdateAttributesValuesInput } from '@cbidigital/aqua';
import { ProductGetOutput } from '@cbidigital/inventory-module/features/product/app/useCases';

// TYPE: create
export type CartCreateInput = {
    userId: string;
    creatorId: Nullable<string>;
    enabled: boolean;
    targetId: Nullable<string>;
    attributeValues?: CreateAttributesValuesInput;
};

export class CartCreateInputModel implements CartCreateInput {
    @Expose()
    @IsDefined()
    @IsUUID()
    public readonly userId!: string;

    @Expose()
    @IsDefined()
    @IsBoolean()
    public readonly enabled!: boolean;

    @Expose()
    @IsUUID()
    public readonly targetId!: Nullable<string>;

    @Expose()
    @IsUUID()
    public readonly creatorId!: Nullable<string>;
}

export type CartCreateOutput = void;

// TYPE: update
export type CartUpdateInput = Partial<CartCreateInput> & {
    userId: string;
    attributeValues?: UpdateAttributesValuesInput;
};

export class CartUpdateInputModel implements CartUpdateInput {
    @Expose()
    @IsDefined()
    @IsUUID()
    public readonly userId!: string;

    @Expose()
    @IsBoolean()
    public readonly enabled!: boolean;

    @Expose()
    @IsUUID()
    public readonly targetId!: Nullable<string>;
}

export type CartUpdateOutput = void;

// TYPE: delete
export type CartDeleteInput = {
    id: string;
};

export class CartDeleteInputModel implements CartDeleteInput {
    @Expose()
    @IsDefined()
    @IsUUID()
    public readonly id!: string;
}

export type CartDeleteOutput = void;

export type CartAddItemInput = {
    productId: string;
    qty: number;
    customPrice?: number;
    stockId?: Nullable<string>;
    product?: ProductGetOutput;
};
export type CartAddListItemInput = {
    items: CartAddItemInput[];
};

export class CartAddItemInputModel implements CartAddItemInput {
    @Expose()
    @IsDefined()
    @IsUUID()
    public readonly productId!: string;
    @Expose()
    @IsDefined()
    @IsInt()
    @Min(1)
    public readonly qty!: number;
    @Expose()
    @IsUUID()
    public readonly stockId?: Nullable<string>;
    @Expose()
    @IsNumber()
    @Min(0)
    public readonly customPrice?: number;
}

export class CartAddListItemInputModel implements CartAddListItemInput {
    @Expose()
    @ValidateNested({ each: true })
    @Type(() => CartAddItemInputModel)
    public readonly items!: CartAddItemInput[];
}

export type CartUpdateItemQtyInput = {
    itemId: string;
    qty: number;
};
export type CartUpdateItemInput = CartUpdateItemQtyInput & {
    customPrice?: number;
};

export class CartUpdateItemQtyInputModel implements CartUpdateItemQtyInput {
    @Expose()
    @IsDefined()
    @IsUUID()
    public readonly itemId!: string;
    @Expose()
    @IsDefined()
    @IsInt()
    @Min(0)
    public readonly qty!: number;
}

export class CartUpdateItemInputModel extends CartUpdateItemQtyInputModel implements CartUpdateItemInput {
    @Expose()
    @IsNumber()
    @Min(0)
    public readonly customPrice?: number;
}

export type CartRemoveItemInput = {
    itemId: string;
};

export class CartRemoveItemInputModel implements CartRemoveItemInput {
    @Expose()
    @IsDefined()
    @IsUUID()
    public readonly itemId!: string;
}
