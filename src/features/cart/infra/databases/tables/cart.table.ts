import {
    Table,
    TABLE_FIELD_DEFAULT_VALUE,
    Column,
    HasMany,
    EavAttributeValueDTO,
    EavEntityTable,
} from '@cbidigital/aqua';
import { Nullable } from '@heronjs/common';
import { TableNames } from '../../../../../constants';
import { CartDTO, CartItemDTO } from '../../../domain/dtos';

@Table({
    name: TableNames.CART,
    eav: { tableLink: TableNames.CART_ATTRIBUTE_VALUE },
})
export class CartTable extends EavEntityTable<CartDTO> implements CartDTO {
    @Column({ isPrimaryKey: true })
    id: string = TABLE_FIELD_DEFAULT_VALUE;

    @Column()
    userId: string = TABLE_FIELD_DEFAULT_VALUE;

    @Column()
    creatorId: Nullable<string> = TABLE_FIELD_DEFAULT_VALUE;

    @Column()
    enabled: boolean = TABLE_FIELD_DEFAULT_VALUE;

    @Column()
    createdAt: Date = TABLE_FIELD_DEFAULT_VALUE;

    @Column()
    updatedAt: Nullable<Date> = TABLE_FIELD_DEFAULT_VALUE;

    @Column()
    targetId: Nullable<string> = TABLE_FIELD_DEFAULT_VALUE;

    @HasMany(TableNames.CART_ITEMS, 'id', 'cart_id')
    items: CartItemDTO[] = TABLE_FIELD_DEFAULT_VALUE;

    @HasMany(TableNames.CART_ATTRIBUTE_VALUE, 'id', 'entity_id')
    attributeValues: EavAttributeValueDTO[] = TABLE_FIELD_DEFAULT_VALUE;
}
