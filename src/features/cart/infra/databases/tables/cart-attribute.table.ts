import { Table, EavAttributeTable } from '@cbidigital/aqua';
import { TableNames } from '../../../../../constants';

@Table({
    name: TableNames.CART_ATTRIBUTE,
})
export class CartAttributeTable extends EavAttributeTable {}
