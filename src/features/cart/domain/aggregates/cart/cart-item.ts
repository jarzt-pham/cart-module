import { AggregateRoot, EntityIdUtil, ValidatorUtil } from '@cbidigital/aqua';
import { Nullable } from '@heronjs/common';
import { CartItemEventNames } from './enums';
import {
    CartItemCreateInput,
    CartItemCreateInputModel,
    CartItemCreateOutput,
    CartItemDeleteOutput,
    CartItemUpdateInput,
    CartItemUpdateInputModel,
    CartItemUpdateOutput,
} from './types';

export type CartItemProps = {
    cartId: string;
    productId: string;
    qty: number;
    createdAt: Date;
    updatedAt: Nullable<Date>;
    stockId?: Nullable<string>;
    customPrice?: number;
};

export class CartItem extends AggregateRoot<CartItemProps> {
    constructor(id?: string, props?: CartItemProps) {
        super(id, props);
    }

    get cartId(): string {
        return this._props.cartId;
    }

    get productId(): string {
        return this._props.productId;
    }

    get qty(): number {
        return this._props.qty;
    }

    get createdAt(): Date {
        return this._props.createdAt;
    }

    get updatedAt(): Nullable<Date> {
        return this._props.updatedAt;
    }

    get stockId(): Nullable<string | undefined> {
        return this._props.stockId;
    }

    get customPrice(): number | undefined {
        return this._props.customPrice;
    }

    /** Methods **/

    private setCartId(payload?: string) {
        if (payload !== undefined) this._props.cartId = payload;
    }

    private setProductId(payload?: string) {
        if (payload !== undefined) this._props.productId = payload;
    }

    private setQty(payload?: number) {
        if (payload !== undefined) this._props.qty = payload;
    }

    private setCreatedAt(payload?: Date) {
        if (payload !== undefined) this._props.createdAt = payload;
    }

    private setUpdatedAt(payload?: Date) {
        if (payload !== undefined) this._props.updatedAt = payload;
    }

    private setStockId(payload?: Nullable<string>) {
        if (payload !== undefined) this._props.stockId = payload;
    }

    private setCustomPrice(payload?: number) {
        if (payload !== undefined) this._props.customPrice = payload;
    }

    async create(payload: CartItemCreateInput): Promise<CartItemCreateOutput> {
        // validator input
        await ValidatorUtil.validatePlain<CartItemCreateInput>(CartItemCreateInputModel, payload);

        // handle logic
        this.setId(EntityIdUtil.randomUUID());
        this.setCartId(payload.cartId);
        this.setProductId(payload.productId);
        this.setCreatedAt(new Date());
        this.setStockId(payload.stockId);
        this.setCustomPrice(payload.customPrice);

        // add events
        this.addDomainEvent({
            aggregateId: this.id,
            type: CartItemEventNames.CREATE,
            meta: this.props,
            createdAt: new Date(),
        });
    }

    async delete(): Promise<CartItemDeleteOutput> {
        // add events
        this.addDomainEvent({
            aggregateId: this.id,
            type: CartItemEventNames.DELETE,
            meta: this.props,
            createdAt: new Date(),
        });
    }

    async update(payload: CartItemUpdateInput): Promise<CartItemUpdateOutput> {
        // validator input
        await ValidatorUtil.validatePlain<CartItemUpdateInput>(CartItemUpdateInputModel, payload);
        // handle logic
        this.setCustomPrice(payload.customPrice);
        this.setUpdatedAt(new Date());
        if (payload.isPlus) {
            this.setQty(this.qty + payload.qty);
        } else {
            this.setQty(payload.qty);
        }
        this.addDomainEvent({
            aggregateId: this.id,
            type: CartItemEventNames.UPDATE,
            meta: this.props,
            createdAt: new Date(),
        });
    }
}
