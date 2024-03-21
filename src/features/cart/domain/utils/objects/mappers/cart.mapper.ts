import { EavAttributeValue, IMapper } from '@cbidigital/aqua';
import { Provider, Scope } from '@heronjs/common';
import { Cart } from '../../../aggregates';
import { CartDTO } from '../../../dtos';
import { MapperTokens } from '../../../../../../constants';

export type ICartMapper = IMapper<CartDTO, Cart>;

@Provider({ token: MapperTokens.CART, scope: Scope.SINGLETON })
export class CartMapper implements ICartMapper {
    fromEntityToDTO(entity: Cart): CartDTO {
        return {
            id: entity.id,
            userId: entity.userId,
            creatorId: entity.creatorId,
            enabled: entity.enabled,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            targetId: entity.targetId,
            items:
                entity.items?.map((i) => ({
                    id: i.id,
                    cartId: i.cartId,
                    productId: i.productId,
                    qty: i.qty,
                    stockId: i.stockId,
                    createdAt: i.createdAt,
                    updatedAt: i.updatedAt,
                })) || [],
            attributeValues: entity.eav.attributeValues.map((a) => ({
                id: a.id,
                value: a.value,
                entityId: a.entityId,
                attributeCode: a.attributeCode,
                createdAt: a.createdAt,
                updatedAt: a.updatedAt,
            })),
        };
    }

    fromDTOToEntity(dto: CartDTO): Cart {
        return new Cart(
            dto.id,
            {
                userId: dto.userId,
                creatorId: dto.creatorId,
                enabled: dto.enabled,
                createdAt: dto.createdAt,
                updatedAt: dto.updatedAt,
                targetId: dto.targetId,
                items: dto.items?.map((item) => {
                    return item;
                }),
            },
            dto.attributeValues?.map((a) => new EavAttributeValue(a.id, a)),
        );
    }
}
