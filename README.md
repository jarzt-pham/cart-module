# Cart Module


The module supports:
* storing and managing cart data
* supporting cart multi store

## Table of Contents

- [Cart Module](#cart-module)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [env](#env)
  - [Usage Connector](#usage-connector)
    - [List Method `CartConnector`](#list-method-cartconnector)
    - [Env Connector](#env-connector)
  - [Swagger](#swagger)
  - [Errors](#errors)


## Installation

```
npm install @cbidigital/cart-module @cbidigital/inventory-module @cbidigital/store-module --save
```

> Note: Please create file .npmrc in folder project.

```
echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > .npmrc
```

## Usage

Import `CartModule` and `Controllers` from `@cbidigital/cart-module` to `AppModule`
Import `ProductConnector` from `@cbidigital/inventory-module` to `providers` in `AppModule`
Import `StoreConnector` from `@cbidigital/store-module` to `providers` in `AppModule`

``` typescript
@Module({
    controllers: [
        AdminCartAttributeController,
        CartAttributeController,
        CartAttributeValueController,
        CartController,
        InternalCartController
    ],
    imports: [CartModule, HealthCheckModule],
    services: [PullPublicKeyIntervalService],
    providers: [ProductConnector, StoreConnector]
})
@GateKeeper(AuthContext, AuthContextResolver)
@Databases([MYSQLDatabase, PostgresDatabase])
@Stores([MemoryCacheConfig])
export class AppModule {}
```
### env

```env
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_SCHEMA=
DATABASE_CLIENT=
DATABASE_SECURE_CONNECT= # true or false - database using ssl
DATABASE_TLS_CERT= # path file cert ssl database

POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
POSTGRES_SECURE_CONNECT=  # true or false - database using ssl
POSTGRES_TLS_CERT= # path file cert ssl database

SECRET_KEY_INTERNAL_API_CART= # secret key for internal api of cart module

AUTHENTICATION_API_URL=
SECRET_KEY_INTERNAL_API_AUTHENTICATION=

PROMOTION_API_URL=
SECRET_KEY_INTERNAL_API_PROMOTION=

INVENTORY_MODULE_HOST=
SECRET_KEY_INTERNAL_API_INVENTORY=
INVENTORY_MODULE_CONNECTION_TYPE=RESTFUL

STORE_MODULE_HOST=
SECRET_KEY_INTERNAL_API_STORE=
STORE_MODULE_CONNECTION_TYPE=RESTFUL

DELIVERY_API_URL=
SECRET_KEY_INTERNAL_API_DELIVERY=

```

## Usage Connector

Install `@cbidigital/cart-module`

```
npm install @cbidigital/cart-module --save
```

Install `@cbidigital/aqua` for using connector

```
npm install @cbidigital/aqua --save
```

Import `CartConnector` from `@cbidigital/cart-module` to `providers` in `AppModule`

``` typescript
@Module({
    ...
    providers: [CartConnector], // add CartConnector
    ...
})
...
export class AppModule {}
```

In your code Inject `CART_CONNECTOR`

``` typescript
...
import { Inject, Provider, Scope } from '@cbidigital/heron-common';

...

constructor(
  ...
  @Inject('CART_CONNECTOR') protected _cartConnector: ModuleConnector<ICartConnectorService>
  ...
) {}

...
const checkoutCartData = await this._cartConnector.service.checkout(
    {
        userId: "0c322d39-efe1-4f3e-8267-3b2e87118d2e",
        cartDetail: [
            {
                targetId: "cb7137dd-156a-4551-a8f7-b388fbc6f0cb",
                selectedCartItems: [
                    "406f0c31-9dfd-423d-a5c8-07919eb0a919"
                ],
                carrierCode: "grab"
            }
        ],
        couponIds: [],
        paymentMethod: null,
    },
  {
      requestConfig: {
          headers: {
              'internal-api-key': process.env.SECRET_KEY_INTERNAL_API_CART
          }
      }
  }
);
...
```

### List Method `CartConnector`


``` typescript
export interface ICartConnectorService {
    preCheckout(
        userId: string,
        input: PreCheckoutInputPayload,
        config?: ModuleConnectorServiceMethodConfig
    ): Promise<PreCheckoutDto>;
    calculatePreCheckout(
        userId: string,
        input: CalculatePreCheckoutInputPayload,
        config?: ModuleConnectorServiceMethodConfig
    ): Promise<CalculatePreCheckoutDto>;
    checkout(input: CheckoutInputPayload, config?: ModuleConnectorServiceMethodConfig): Promise<CheckoutDto>;
    updateStatusFailedCartCheckout(
        input: UpdateStatusFailedCartCheckoutInputPayload,
        config?: ModuleConnectorServiceMethodConfig
    ): Promise<void>;
    updateStatusCompletedCartCheckout(
        input: UpdateStatusCompletedCartCheckoutInputPayload,
        config?: ModuleConnectorServiceMethodConfig
    ): Promise<void>;

    getCart(userId: string, config?: ModuleConnectorServiceMethodConfig): Promise<CartInfoDto>;
    remove(userId: string, cartItemId: string, config?: ModuleConnectorServiceMethodConfig): Promise<void>;
    checkoutWithDelivery(
        input: CheckoutWithDeliveryInputPayload,
        config?: ModuleConnectorServiceMethodConfig
    ): Promise<CheckoutWithDeliveryDto>;

    rollbackCartCheckout(
        input: RollBackCartCheckoutInputPayload,
        config?: ModuleConnectorServiceMethodConfig
    ): Promise<void>;
}

```

### Env Connector


``` env
CART_MODULE_HOST= # url cart api (Optional), required if using USER_MODULE_CONNECTION_TYPE=RESTFUL
SECRET_KEY_INTERNAL_API_CART=
CART_MODULE_CONNECTION_TYPE= # RESTFUL or INJECTION
```

## Swagger
File swagger docs [here](./docs/openapi.yaml)

## Errors

- Cart:

| Class                                      | Error code | Message                                                                                 | HttpStatusCode             |
|--------------------------------------------|------------|-----------------------------------------------------------------------------------------|----------------------------|
| CartNotFoundError                          | CART:10000 | Cart not found                                                                          | NOT_FOUND: 404             |
| AddDisabledProductToCartError              | CART:11000 | Product $product_id$ is disabled                                                        | BAD_REQUEST: 400           |
| NotFoundCartItemsInListError               | CART:11001 | Not found cart items in list                                                            | BAD_REQUEST: 400           |
| NotPreCheckoutDisabledProductError         | CART:11002 | Not pre checkout disabled product                                                       | BAD_REQUEST: 400           |
| CartItemNotFoundError                      | CART:11003 | Cart item not found                                                                     | NOT_FOUND: 404             |
| MinSpendNotEnoughError                     | CART:11004 | Min spend not enough                                                                    | BAD_REQUEST: 400           |
| CouponNotApplicableToThisCartError         | CART:11005 | Coupon is not applicable to this cart                                                   | BAD_REQUEST: 400           |
| AddProductNotFoundToCartError              | CART:11006 | Product $product_id$ not found                                                          | BAD_REQUEST: 400           |
| ProductQuantityNotEnoughError              | CART:11007 | Product $product_id$'s quantity is not enough                                           | BAD_REQUEST: 400           |
| ProductFeatureTypeNotMatchEachOtherError   | CART:11008 | Please select the same product type as package or physical product to continue checkout | BAD_REQUEST: 400           |
| NotAllowAddConfigurationProductToCartError | CART:11009 | Configuration product $product_id$ is not allow add to cart                             | BAD_REQUEST: 400           |
| NotFoundShippingOptionError                | CART:11010 | Shipping $carrier_code$ option not found                                                | BAD_REQUEST: 400           |
| ShippingOptionCannotUseError               | CART:11011 | Shipping $carrier_code$ option cannot use this time                                     | BAD_REQUEST: 400           |
| ProductFeatureTypeCannotDeliveryError      | CART:11012 | Product $product_id$ feature type is $feature_type$ cannot delivery                     | BAD_REQUEST: 400           |
| ProductNotSetTargetIdError                 | CART:11013 | Product $product_id$'s has not target id                                                | BAD_REQUEST: 400           |
| SenderHasNotAddressError                   | CART:11014 | Sender $sender_id$'s has not address                                                    | INTERNAL_SERVER_ERROR: 500 |
