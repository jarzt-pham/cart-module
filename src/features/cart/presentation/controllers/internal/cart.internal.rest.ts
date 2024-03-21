// import { Get, Inject, Rest, UseInterceptors, Body, Post } from '@heronjs/common';
// import { SalesRuleTokens } from '../../../../../../../constants';
// import { ModuleConnectorConfig } from '../../../../../../../configs';
// import { AuthorizeSecretKeyInterceptor } from '@cbidigital/nightcore';
// import { ICouponService, UpdateCouponUsageInput } from '../../../../../domain/service/coupon';
// import { CouponDTO } from '../../../../../domain/dtos';
// import { StatusCodes } from 'http-status-codes';

// @Rest('/internal/coupons')
// export class InternalCouponRest {
//     constructor(
//         @Inject(SalesRuleTokens.COUPON_SERVICE)
//         private readonly _couponService: ICouponService,
//     ) {}

// @Get({ uri: '/checkout', code: StatusCodes.OK })
// @UseInterceptors([AuthorizeSecretKeyInterceptor(ModuleConnectorConfig.restfulConfig.secretKey)])
// public async checkout(
//     @Query('includes') includes: string[] | string,
//     @Body() payload: CheckoutInputPayload | CheckoutWithDeliveryInputPayload,
// ): Promise<any> {
//     if (this._checkIncludeDelivery(includes)) {
//         const input = await CheckoutWithDeliveryInput.create(payload as CheckoutWithDeliveryInputPayload);
//         return this._service.checkoutWithDelivery(input);
//     } else {
//         const input = await CheckoutInput.create(payload as CheckoutInputPayload);
//         return this._service.checkout(input);
//     }
// }
//
// @Post({ uri: '/coupon-usage' })
// @UseInterceptors([AuthorizeSecretKeyInterceptor(ModuleConnectorConfig.restfulConfig.secretKey)])
// public async updateCouponUsage(@Body() input: UpdateCouponUsageInput): Promise<CouponDTO> {
//     return this._couponService.updateCouponUsage(input);
// }
// }
