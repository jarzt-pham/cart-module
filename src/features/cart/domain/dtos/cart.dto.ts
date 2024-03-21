import { EavEntityDTO } from '@cbidigital/aqua';
import { Nullable, Optional } from '@heronjs/common';
import { CartItemDTO } from './cart-items.dto';

export type CartDTO = {
    id: string;
    userId: string;
    creatorId: Nullable<string>;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Nullable<Date>;
    targetId: Nullable<string>;
    items: Optional<CartItemDTO[]>;
} & EavEntityDTO;
