import { IMapper } from '@cbidigital/aqua';
import { Provider, Scope } from '@heronjs/common';
import { CartItem } from '../../../aggregates';
import { CartItemDTO } from '../../../dtos';
import { MapperTokens } from '../../../../../../constants';

export type ICartItemMapper = IMapper<CartItemDTO, CartItem>;

@Provider({ token: MapperTokens.CART_ITEM, scope: Scope.SINGLETON })
export class CartItemMapper implements ICartItemMapper {
    fromEntityToDTO(entity: CartItem): CartItemDTO {
        return {
            id: entity.id,
            cartId: entity.cartId,
            productId: entity.productId,
            qty: entity.qty,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            stockId: entity.stockId,
            customPrice: entity.customPrice,
        };
    }

    fromDTOToEntity(dto: CartItemDTO): CartItem {
        return new CartItem(dto.id, {
            cartId: dto.cartId,
            productId: dto.productId,
            qty: dto.qty,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            stockId: dto.stockId,
            customPrice: dto.customPrice,
        });
    }
}
