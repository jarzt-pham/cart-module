import { Inject, Provider, Scope } from '@heronjs/common';
import { RepoTokens, UseCaseTokens, ProviderTokens } from '../../../../../../constants';
import { ICartRepo } from '../../../../domain/repos';
import {
    PlaceOrderUseCaseInput,
    PlaceOrderUseCaseOutput,
    PlaceOrderUseCaseContext,
    PlaceOrderUseCaseInputModel,
    PlaceOrderUseCaseMapInput,
    PlaceOrderUseCaseMapOutput,
    PlaceOrderUseCaseProcessingInput,
    PlaceOrderUseCaseProcessingOutput,
    PlaceOrderUseCaseValidateInput,
    PlaceOrderUseCaseValidateOutput,
} from './types';
import {
    CreateAttributesValuesInput,
    EntityIdUtil,
    IUseCase,
    UseCase,
    UseCasePipeMethod,
    ValidatorUtil,
} from '@cbidigital/aqua';

import { IPreCheckoutUseCase } from './pre-checkout.usecase';
import { ProductChangeHoldingQuantityModelPayload } from '@cbidigital/inventory-module/features/product/app/useCases';
import { IProductProvider } from '../../../../domain/providers/product';
import { IOrderProvider } from '../../../../domain/providers/order';
import { IPaymentProvider } from '../../../../domain/providers/payment';
import { IPromotionProvider } from '../../../../domain/providers/promotion';
import { CartConfig } from '../../../../../../configs/cart.config';

export type IPlaceOrderUseCase = IUseCase<
    PlaceOrderUseCaseInput,
    PlaceOrderUseCaseOutput,
    PlaceOrderUseCaseContext
>;

@Provider({ token: UseCaseTokens.PLACE_ORDER, scope: Scope.REQUEST })
export class PlaceOrderUseCase
    extends UseCase<PlaceOrderUseCaseInput, PlaceOrderUseCaseOutput, PlaceOrderUseCaseContext>
    implements IPlaceOrderUseCase
{
    constructor(
        @Inject(RepoTokens.CART) protected _repo: ICartRepo,
        @Inject(UseCaseTokens.PRE_CHECKOUT) protected _preCheckoutUseCase: IPreCheckoutUseCase,
        @Inject(ProviderTokens.PRODUCT_PROVIDER) protected _productProvider: IProductProvider,
        @Inject(ProviderTokens.ORDER_PROVIDER) protected _orderProvider: IOrderProvider,
        @Inject(ProviderTokens.PAYMENT_PROVIDER) protected _paymentProvider: IPaymentProvider,
        @Inject(ProviderTokens.PROMOTION_PROVIDER) protected _promotionProvider: IPromotionProvider,
    ) {
        super();
        this.setMethods([this.validate, this.processing, this.map]);
    }

    validate: UseCasePipeMethod<PlaceOrderUseCaseValidateInput, PlaceOrderUseCaseValidateOutput> = async (
        input,
    ) => {
        return await ValidatorUtil.validatePlain<PlaceOrderUseCaseInput>(PlaceOrderUseCaseInputModel, input);
    };

    processing: UseCasePipeMethod<PlaceOrderUseCaseProcessingInput, PlaceOrderUseCaseProcessingOutput> =
        async (input) => {
            const isAdmin = this.context.auth.isAdmin;
            let userId;
            if (isAdmin) userId = input.userId;
            if (!userId) userId = this.context.auth.authId!;
            // Rollback data
            const itemQuantitiesRollback: ProductChangeHoldingQuantityModelPayload[] = [];
            // const couponUsageRollBack: string[] = [];
            let rollbackItemQuantities = false;
            // let rollbackCouponUsage = false;
            try {
                // Get pre checkout data
                const preCheckoutData = await this._preCheckoutUseCase.exec(input, {
                    auth: this.context.auth,
                });
                const cartDetails = preCheckoutData.cartDetails;
                // Increase product holding quantity
                const itemQuantities: ProductChangeHoldingQuantityModelPayload[] = [];
                const listItemId = [];
                const listNewOrderId = [];
                for (const cart of cartDetails) {
                    const cartItems = cart.items;
                    for (const cartItem of cartItems) {
                        listItemId.push(cartItem.id);
                        if (cartItem.product.itemStock) {
                            itemQuantities.push({
                                itemStockId: cartItem.product.itemStock.id,
                                quantity: cartItem.qty,
                            });
                            itemQuantitiesRollback.push({
                                itemStockId: cartItem.product.itemStock.id,
                                quantity: cartItem.qty * -1,
                            });
                        }
                    }
                    cart.newOrderId = EntityIdUtil.randomUUID();
                    listNewOrderId.push(cart.newOrderId);
                }
                if (itemQuantities.length) {
                    await this._productProvider.changeListHoldingQty(itemQuantities);
                    rollbackItemQuantities = true;
                }
                // Increase coupon total usage
                // const coupons = input.couponsApplied;
                // if (coupons && coupons.length) {
                //     coupons.map((id) => {
                //         this._promotionProvider.updateCouponUsage({
                //             couponId: id,
                //             customerId: userId,
                //             isPlusTotalUsage: true,
                //         });
                //         couponUsageRollBack.push(id);
                //     });
                //     rollbackCouponUsage = true;
                // }

                // Create payment
                const payment = await this._paymentProvider.payOrders({
                    methodCode: input.paymentMethodCode,
                    orderIds: listNewOrderId,
                    sourceType: 'order',
                    currency: CartConfig.CURRENCY,
                    amount: preCheckoutData.grandTotal,
                    paymentPlatform: input.paymentPlatform,
                    auth: this.context.auth,
                });

                // Create orders and order aggregates
                const orderAttributes = [] as CreateAttributesValuesInput;
                if (input.orderAttributes) {
                    for (const [code, value] of Object.entries(input.orderAttributes)) {
                        orderAttributes.push({
                            code,
                            value,
                        });
                    }
                }
                const orders = await this._orderProvider.create({
                    userId,
                    userTargetId: input.userTargetId,
                    payment,
                    cart: preCheckoutData,
                    attributeValues: orderAttributes,
                });
                // Checkout success: remove cart items
                await this._repo.deleteListItemByListId(listItemId);
                return {
                    orders,
                    payment: {
                        id: payment.transaction.id,
                        status: payment.transaction.status,
                    },
                };
            } catch (error) {
                if (rollbackItemQuantities && itemQuantitiesRollback.length) {
                    await this._productProvider.changeListHoldingQty(itemQuantitiesRollback);
                }
                throw error;
                // if (rollbackCouponUsage && couponUsageRollBack.length) {
                //     couponUsageRollBack.map((id) => {
                //         this._promotionProvider.updateCouponUsage({
                //             couponId: id,
                //             customerId: userId,
                //             isPlusTotalUsage: false,
                //         });
                //     });
                // }
            }
        };

    map: UseCasePipeMethod<PlaceOrderUseCaseMapInput, PlaceOrderUseCaseMapOutput> = async (input) => {
        return input;
    };
}
