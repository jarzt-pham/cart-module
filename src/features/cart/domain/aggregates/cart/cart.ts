import { AggregateRoot, EavAttributeValue, EavEntity, EntityIdUtil, ValidatorUtil } from '@cbidigital/aqua';
import { Nullable, Optional } from '@heronjs/common';
import { CartEventNames } from './enums';
import {
    CartAddListItemInput,
    CartCreateInput,
    CartCreateInputModel,
    CartCreateOutput,
    CartDeleteOutput,
    CartUpdateInput,
    CartUpdateInputModel,
    CartUpdateOutput,
} from './types';
import { CartItemDTO } from '../../dtos';

export type CartProps = {
    userId: string;
    creatorId: Nullable<string>;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Nullable<Date>;
    targetId: Nullable<string>;
    items: Optional<CartItemDTO[]>;
};

export class Cart extends AggregateRoot<CartProps> {
    private readonly _eav: EavEntity;

    constructor(id?: string, props?: CartProps, attributeValues?: EavAttributeValue[]) {
        super(id, props);
        this._eav = new EavEntity(this, attributeValues);
    }

    /** Props **/
    get eav(): EavEntity {
        return this._eav;
    }

    get userId(): string {
        return this._props.userId;
    }

    get creatorId(): Nullable<string> {
        return this._props.creatorId;
    }

    get enabled(): boolean {
        return this._props.enabled;
    }

    get createdAt(): Date {
        return this._props.createdAt;
    }

    get updatedAt(): Nullable<Date> {
        return this._props.updatedAt;
    }

    get targetId(): Nullable<string> {
        return this._props.targetId;
    }

    get items(): Optional<CartItemDTO[]> {
        return this._props.items;
    }

    /** Methods **/

    private setUserId(payload?: string) {
        if (payload !== undefined) this._props.userId = payload;
    }

    private setCreatorId(payload?: Nullable<string>) {
        if (payload !== undefined) this._props.creatorId = payload;
    }

    private setEnabled(payload?: boolean) {
        if (payload !== undefined) this._props.enabled = payload;
    }

    private setCreatedAt(payload?: Date) {
        if (payload !== undefined) this._props.createdAt = payload;
    }

    private setUpdatedAt(payload?: Date) {
        if (payload !== undefined) this._props.updatedAt = payload;
    }

    private setTargetId(payload?: Nullable<string>) {
        if (payload !== undefined) this._props.targetId = payload;
    }

    private setItems(payload?: CartItemDTO[]) {
        if (payload !== undefined) this._props.items = payload;
    }

    async create(payload: CartCreateInput): Promise<CartCreateOutput> {
        // validator input
        await ValidatorUtil.validatePlain<CartCreateInput>(CartCreateInputModel, payload);

        // handle logic
        this.setId(EntityIdUtil.randomUUID());
        this.setUserId(payload.userId);
        this.setEnabled(payload.enabled);
        this.setCreatedAt(new Date());
        this.setTargetId(payload.targetId);
        this.setCreatorId(payload.creatorId);

        // add events
        this.addDomainEvent({
            aggregateId: this.id,
            type: CartEventNames.CREATE,
            meta: this.props,
            createdAt: new Date(),
        });
    }

    async update(payload: CartUpdateInput): Promise<CartUpdateOutput> {
        // validator input
        await ValidatorUtil.validatePlain<CartUpdateInput>(CartUpdateInputModel, payload);
        // handle logic
        this.setEnabled(payload.enabled);
        this.setUpdatedAt(new Date());
        this.setTargetId(payload.targetId);
        this.setCreatorId(payload.creatorId);
        // add events
        this.addDomainEvent({
            aggregateId: this.id,
            type: CartEventNames.UPDATE,
            meta: this.props,
            createdAt: new Date(),
        });
    }

    async delete(): Promise<CartDeleteOutput> {
        // add events
        this.addDomainEvent({
            aggregateId: this.id,
            type: CartEventNames.DELETE,
            meta: this.props,
            createdAt: new Date(),
        });
    }

    async updateItems(payload: CartAddListItemInput): Promise<void> {
        const currentItems = this.items;
        const updatedItems = [] as CartItemDTO[];
        for (const item of payload.items) {
            let match = undefined;
            if (currentItems) {
                for (const currentItem of currentItems) {
                    if (currentItem.productId === item.productId) {
                        match = currentItem;
                        break;
                    }
                }
            }
            if (match) {
                updatedItems.push({
                    ...match,
                    qty: match.qty + item.qty,
                    updatedAt: new Date(),
                    product: item.product,
                    customPrice: item.customPrice,
                });
            } else {
                updatedItems.push({
                    id: EntityIdUtil.randomUUID(),
                    cartId: this.id,
                    product: item.product,
                    productId: item.productId,
                    qty: item.qty,
                    stockId: item.stockId,
                    createdAt: new Date(),
                    updatedAt: null,
                    customPrice: item.customPrice,
                });
            }
        }
        this.setItems(updatedItems);
        this.addDomainEvent({
            aggregateId: this.id,
            type: CartEventNames.UPDATE_ITEMS,
            meta: this.props,
            createdAt: new Date(),
        });
    }
}
