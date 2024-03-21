import { Table, TABLE_FIELD_DEFAULT_VALUE, Column } from '@cbidigital/aqua';
import { Nullable } from '@heronjs/common';
import { TableNames } from '../../../../../constants';
import { CartItemDTO } from '../../../domain/dtos';
import { BaseTable } from '@cbidigital/aqua/database/table/table';

@Table({
    name: TableNames.CART_ITEMS,
})
export class CartItemsTable extends BaseTable implements CartItemDTO {
    @Column({ isPrimaryKey: true })
    id: string = TABLE_FIELD_DEFAULT_VALUE;

    @Column()
    cartId: string = TABLE_FIELD_DEFAULT_VALUE;

    @Column()
    productId: string = TABLE_FIELD_DEFAULT_VALUE;

    @Column()
    qty: number = TABLE_FIELD_DEFAULT_VALUE;

    @Column()
    stockId: string = TABLE_FIELD_DEFAULT_VALUE;

    @Column()
    createdAt: Date = TABLE_FIELD_DEFAULT_VALUE;

    @Column()
    updatedAt: Nullable<Date> = TABLE_FIELD_DEFAULT_VALUE;

    @Column()
    customPrice: number = TABLE_FIELD_DEFAULT_VALUE;
}
