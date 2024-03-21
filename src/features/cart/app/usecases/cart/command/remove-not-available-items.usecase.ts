import { Inject, Provider, Scope } from '@heronjs/common';
import {
    CartTokens,
    DAOTokens,
    MapperTokens,
    ProviderTokens,
    RepoTokens,
    UseCaseTokens,
} from '../../../../../../constants';
import { ICartRepo } from '../../../../domain/repos';
import {
    RemoveNotAvailableItemsUseCaseInput,
    RemoveNotAvailableItemsUseCaseOutput,
    RemoveNotAvailableItemsUseCaseContext,
    RemoveNotAvailableItemsUseCaseMapInput,
    RemoveNotAvailableItemsUseCaseMapOutput,
    RemoveNotAvailableItemsUseCaseProcessingInput,
    RemoveNotAvailableItemsUseCaseProcessingOutput,
    RemoveNotAvailableItemsUseCaseValidateInput,
    RemoveNotAvailableItemsUseCaseValidateOutput,
} from './types';
import { IUseCase, UseCase, UseCasePipeMethod } from '@cbidigital/aqua';
import { IProductProvider } from '../../../../domain/providers/product';
import { IProductValidator } from '../../../../domain/utils/validator/product';
import { ICartDAO } from '../../../../infra/databases';
import { ICartMapper } from '../../../../domain/utils/objects';
import { CartNotFoundError } from '../../../../domain/errors';

export type IRemoveNotAvailableItemsUseCase = IUseCase<
    RemoveNotAvailableItemsUseCaseInput,
    RemoveNotAvailableItemsUseCaseOutput,
    RemoveNotAvailableItemsUseCaseContext
>;

@Provider({ token: UseCaseTokens.REMOVE_NOT_AVAILABLE_ITEMS, scope: Scope.REQUEST })
export class RemoveNotAvailableItemsUseCase
    extends UseCase<
        RemoveNotAvailableItemsUseCaseInput,
        RemoveNotAvailableItemsUseCaseOutput,
        RemoveNotAvailableItemsUseCaseContext
    >
    implements IRemoveNotAvailableItemsUseCase
{
    constructor(
        @Inject(RepoTokens.CART) private readonly _repo: ICartRepo,
        @Inject(DAOTokens.CART) private readonly _cartDAO: ICartDAO,
        @Inject(MapperTokens.CART) private readonly _cartMapper: ICartMapper,
        @Inject(ProviderTokens.PRODUCT_PROVIDER) private _productProvider: IProductProvider,
        @Inject(CartTokens.PRODUCT_VALIDATOR) private _productValidator: IProductValidator,
    ) {
        super();
        this.setMethods([this.validate, this.processing, this.map]);
    }

    validate: UseCasePipeMethod<
        RemoveNotAvailableItemsUseCaseValidateInput,
        RemoveNotAvailableItemsUseCaseValidateOutput
    > = async (input) => {
        return input;
    };

    processing: UseCasePipeMethod<
        RemoveNotAvailableItemsUseCaseProcessingInput,
        RemoveNotAvailableItemsUseCaseProcessingOutput
    > = async () => {
        const userId = this.context.auth.authId!;
        const listItemNotAvailable = [];
        const cartList = await this._cartDAO.find(
            {
                filter: {
                    userId: { eq: userId },
                    enabled: { eq: true },
                },
            },
            { resolve: ['items'] },
        );
        if (!cartList) throw new CartNotFoundError();
        const mapItemsByStockId: Record<string, { itemId: string; productId: string; qty: number }[]> = {};
        for (const cart of cartList) {
            if (cart.items) {
                for (const item of cart.items) {
                    if (item.stockId) {
                        if (!mapItemsByStockId[item.stockId]) mapItemsByStockId[item.stockId] = [];
                        mapItemsByStockId[item.stockId].push({
                            itemId: item.id,
                            productId: item.productId,
                            qty: item.qty,
                        });
                    } else {
                        if (!mapItemsByStockId['noStockId']) mapItemsByStockId['noStockId'] = [];
                        mapItemsByStockId['noStockId'].push({
                            itemId: item.id,
                            productId: item.productId,
                            qty: item.qty,
                        });
                    }
                }
            }
        }
        for (const stockId in mapItemsByStockId) {
            const listProductId = [];
            const mapProductIdQty: Record<string, number> = {};
            const mapProductIdItemId: Record<string, string> = {};
            for (const item of mapItemsByStockId[stockId]) {
                mapProductIdQty[item.productId] = item.qty;
                mapProductIdItemId[item.productId] = item.itemId;
                listProductId.push(item.productId);
            }
            const productStockId = stockId !== 'noStockId' ? stockId : undefined;
            const mapProducts = await this._productProvider.getMapProductsByListIds(
                listProductId,
                productStockId,
            );
            for (const productId of listProductId) {
                const product = mapProducts[productId];
                try {
                    this._productValidator.checkProductBeforeAddToCart(product, {
                        productId,
                        qty: mapProductIdQty[productId],
                        stockId: productStockId,
                    });
                } catch (error) {
                    listItemNotAvailable.push(mapProductIdItemId[productId]);
                }
            }
        }
        if (listItemNotAvailable.length) await this._repo.deleteListItemByListId(listItemNotAvailable);
    };

    map: UseCasePipeMethod<RemoveNotAvailableItemsUseCaseMapInput, RemoveNotAvailableItemsUseCaseMapOutput> =
        async () => {
            return;
        };
}
