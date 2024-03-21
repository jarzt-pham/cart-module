import {
    Table,
    EavAttributeValueTable,
    EavAttributeDTO,
    HasOne,
    TABLE_FIELD_DEFAULT_VALUE,
} from '@cbidigital/aqua';
import { TableNames } from '../../../../../constants';

@Table({
    name: TableNames.CART_ATTRIBUTE_VALUE,
})
export class CartAttributeValueTable extends EavAttributeValueTable {
    @HasOne(TableNames.CART_ATTRIBUTE, 'attribute_code', 'code')
    attribute: EavAttributeDTO = TABLE_FIELD_DEFAULT_VALUE;
}
