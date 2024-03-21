import { Inject, Provider, Scope } from '@heronjs/common';
import { CartTokens, ProviderTokens, RepoTokens, UseCaseTokens } from '../../../../../../constants';
import { ICartRepo } from '../../../../domain/repos';
import {
    PreCheckoutUseCaseInput,
    PreCheckoutUseCaseOutput,
    PreCheckoutUseCaseContext,
    PreCheckoutUseCaseInputModel,
    PreCheckoutUseCaseMapInput,
    PreCheckoutUseCaseMapOutput,
    PreCheckoutUseCaseProcessingInput,
    PreCheckoutUseCaseProcessingOutput,
    PreCheckoutUseCaseValidateInput,
    PreCheckoutUseCaseValidateOutput,
} from './types';
import { AuthInput, IUseCase, UseCase, UseCasePipeMethod, ValidatorUtil } from '@cbidigital/aqua';
import {
    CartAddItemInput,
    CartPreCheckoutDetail,
    CartPreCheckoutOutput,
    CartPreCheckoutInput,
} from '../../../../domain/aggregates';
import { IProductProvider } from '../../../../domain/providers/product';
import { IProductValidator } from '../../../../domain/utils/validator/product';
import { CartItemDTO, CartItemPreCheckoutDTO } from '../../../../domain/dtos';
import { IPromotionProvider } from '../../../../domain/providers/promotion';
import { CartItemNotBelongToUserError } from '../../../../domain/errors/cart-item/cart-item-not-belong-to-user.error';

export type IPreCheckoutUseCase = IUseCase<
    PreCheckoutUseCaseInput,
    PreCheckoutUseCaseOutput,
    PreCheckoutUseCaseContext
> & {
    getPreCheckoutData: (input: CartPreCheckoutInput, auth: AuthInput) => Promise<CartPreCheckoutOutput>;
};

type ProductWithAttributes = {
    attributes?: {
        taxVAT?: number;
    };
};

@Provider({ token: UseCaseTokens.PRE_CHECKOUT, scope: Scope.REQUEST })
export class PreCheckoutUseCase
    extends UseCase<PreCheckoutUseCaseInput, PreCheckoutUseCaseOutput, PreCheckoutUseCaseContext>
    implements IPreCheckoutUseCase
{
    constructor(
        @Inject(RepoTokens.CART) private readonly _repo: ICartRepo,
        @Inject(ProviderTokens.PRODUCT_PROVIDER) private _productProvider: IProductProvider,
        @Inject(ProviderTokens.PROMOTION_PROVIDER) private _promotionProvider: IPromotionProvider,
        @Inject(CartTokens.PRODUCT_VALIDATOR) private _productValidator: IProductValidator,
    ) {
        super();
        this.setMethods([this.validate, this.processing, this.map]);
    }

    validate: UseCasePipeMethod<PreCheckoutUseCaseValidateInput, PreCheckoutUseCaseValidateOutput> = async (
        input,
    ) => {
        return await ValidatorUtil.validatePlain<PreCheckoutUseCaseInput>(
            PreCheckoutUseCaseInputModel,
            input,
        );
    };

    processing: UseCasePipeMethod<PreCheckoutUseCaseProcessingInput, PreCheckoutUseCaseProcessingOutput> =
        async (input) => {
            return this.getPreCheckoutData(input, this.context.auth);
        };

    map: UseCasePipeMethod<PreCheckoutUseCaseMapInput, PreCheckoutUseCaseMapOutput> = async (input) => {
        return input;
    };

    public async getPreCheckoutData(
        input: CartPreCheckoutInput,
        auth: AuthInput,
    ): Promise<CartPreCheckoutOutput> {
        let totalItem = 0;
        let totalItemQty = 0;
        let taxVAT = 0;
        const shippingFee = 0;
        let grandTotal = 0;
        const isAdmin = auth.isAdmin;
        const authId = auth.authId!;
        const validTargetIds: string[] = auth.metadata?.validTargetIds;

        const cartDetails = [] as CartPreCheckoutDetail[];
        let selectedItems;
        if (input.selectedItems) {
            selectedItems = await this._repo.getListItemByListId(input.selectedItems, true);
        } else {
            selectedItems = await this._repo.getAllItem(authId, isAdmin);
        }

        // const mapItemsByStockId: Record<string, CartAddItemInput[]> = {};
        const mapItemsByStockId: Record<string, CartAddItemInput[]> = {};
        const subtotalByTargetId: Record<string, number> = {};
        const itemsByTargetId: Record<string, CartItemPreCheckoutDTO[]> = {};
        const itemByProductId: Record<string, CartItemDTO> = {};
        let checkItemBelongUser = false;
        for (const item of selectedItems) {
            if (!checkItemBelongUser) {
                // check if item belong to user or creator
                if (isAdmin) {
                    await this._repo.getById(item.cartId, authId, false, false, true);
                } else {
                    await this._repo.getById(item.cartId, authId);
                }
                // only check first item for performance issue
                checkItemBelongUser = true;
            }
            if (item.stockId) {
                if (!mapItemsByStockId[item.stockId]) mapItemsByStockId[item.stockId] = [];
                mapItemsByStockId[item.stockId].push(item);
            } else {
                if (!mapItemsByStockId['noStockId']) mapItemsByStockId['noStockId'] = [];
                mapItemsByStockId['noStockId'].push(item);
            }
            itemByProductId[item.productId] = item;
        }
        for (const stockId in mapItemsByStockId) {
            const listProductId = [];
            const mapProductIdQty: Record<string, number> = {};
            const mapProductIdCustomPrice: Record<string, number | undefined> = {};
            for (const item of mapItemsByStockId[stockId]) {
                mapProductIdQty[item.productId] = item.qty;
                mapProductIdCustomPrice[item.productId] = item.customPrice;
                listProductId.push(item.productId);
            }
            const productStockId = stockId !== 'noStockId' ? stockId : undefined;
            const mapProducts = await this._productProvider.getMapProductsByListIds(
                listProductId,
                productStockId,
            );
            for (const productId of listProductId) {
                const product = mapProducts[productId];
                const productQty = mapProductIdQty[productId];
                const customPrice = mapProductIdCustomPrice[productId];
                let productPrice;
                if (isAdmin) {
                    productPrice = customPrice ?? product.finalPrice;
                } else {
                    productPrice = product.finalPrice;
                }
                product.finalPrice = productPrice;
                const targetId = product.targetId ? product.targetId : 'noTargetId';
                // validate

                if (targetId != 'noTargetId' && validTargetIds && !validTargetIds.includes(targetId)) {
                    throw new CartItemNotBelongToUserError();
                }

                this._productValidator.checkProductBeforeAddToCart(product, {
                    productId,
                    qty: productQty,
                    stockId: productStockId,
                });
                // calculate product taxVAT
                const productTax = (product as unknown as ProductWithAttributes).attributes?.taxVAT ?? 0;
                taxVAT += productQty * productPrice * (1 - 100 / (100 + productTax));
                grandTotal += productPrice * productQty;
                totalItem += 1;
                totalItemQty += productQty;
                // map output data
                if (!subtotalByTargetId[targetId]) subtotalByTargetId[targetId] = 0;
                subtotalByTargetId[targetId] += productPrice * productQty;
                itemByProductId[productId].product = product;
                if (!itemsByTargetId[targetId]) itemsByTargetId[targetId] = [];
                itemsByTargetId[targetId].push(itemByProductId[productId] as CartItemPreCheckoutDTO);
            }
        }
        // todo: implement here
        // Verify coupons here

        // const userInfo = this._userProvider.getUserInfo()
        // const ops: Promise<any>[] = [];
        // const couponApplied = input.couponsApplied;
        // if (couponApplied && couponApplied.length) {
        //     couponApplied.map(() => {
        //         ops.push(this._promotionProvider.verifyCoupon({} as VerifyCouponInput));
        //     });
        // }
        // const fetchData = await Promise.all(ops);

        // Calculate discount amount here

        // Calculate TAX here

        // Calculate VAT here

        // Calculate additional fee here

        // Return final result
        for (const targetId in itemsByTargetId) {
            const finalTargetId = targetId === 'noTargetId' ? null : targetId;
            cartDetails.push({
                targetId: finalTargetId,
                items: itemsByTargetId[targetId],
                subtotal: Math.round(subtotalByTargetId[targetId]),
                newOrderId: null,
            });
        }

        return {
            cartDetails,
            grandTotal: Math.round(grandTotal),
            totalItem,
            totalItemQty,
            checkoutPriceData: {
                shippingFee,
                taxVAT: Math.round(taxVAT),
            },
        } as CartPreCheckoutOutput;
    }
}
