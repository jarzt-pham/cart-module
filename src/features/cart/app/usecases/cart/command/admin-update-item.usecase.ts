import { Inject, Provider, Scope } from '@heronjs/common';
import { CartTokens, ProviderTokens, RepoTokens, UseCaseTokens } from '../../../../../../constants';
import {
    AdminUpdateItemUseCaseInput,
    AdminUpdateItemUseCaseOutput,
    AdminUpdateItemUseCaseContext,
    AdminUpdateItemUseCaseInputModel,
    AdminUpdateItemUseCaseMapInput,
    AdminUpdateItemUseCaseMapOutput,
    AdminUpdateItemUseCaseProcessingInput,
    AdminUpdateItemUseCaseProcessingOutput,
    AdminUpdateItemUseCaseValidateInput,
    AdminUpdateItemUseCaseValidateOutput,
} from './types';
import { IUseCase, UseCase, UseCasePipeMethod, ValidatorUtil } from '@cbidigital/aqua';
import { ICartRepo } from '../../../../domain/repos';
import { IProductProvider } from '../../../../domain/providers/product';
import { IProductValidator } from '../../../../domain/utils/validator/product';

export type IAdminUpdateItemUseCase = IUseCase<
    AdminUpdateItemUseCaseInput,
    AdminUpdateItemUseCaseOutput,
    AdminUpdateItemUseCaseContext
>;

@Provider({ token: UseCaseTokens.ADMIN_UPDATE_ITEM, scope: Scope.REQUEST })
export class AdminUpdateItemUseCase
    extends UseCase<AdminUpdateItemUseCaseInput, AdminUpdateItemUseCaseOutput, AdminUpdateItemUseCaseContext>
    implements IAdminUpdateItemUseCase
{
    constructor(
        @Inject(RepoTokens.CART) protected readonly _repo: ICartRepo,
        @Inject(ProviderTokens.PRODUCT_PROVIDER) private _productProvider: IProductProvider,
        @Inject(CartTokens.PRODUCT_VALIDATOR) private _productValidator: IProductValidator,
    ) {
        super();
        this.setMethods([this.validate, this.processing, this.map]);
    }

    validate: UseCasePipeMethod<AdminUpdateItemUseCaseValidateInput, AdminUpdateItemUseCaseValidateOutput> =
        async (input) => {
            input = await ValidatorUtil.validatePlain<AdminUpdateItemUseCaseInput>(
                AdminUpdateItemUseCaseInputModel,
                input,
            );
            const cartItem = await this._repo.getItemById(input.itemId, true);
            const product = await this._productProvider.getProductById(cartItem.productId, cartItem.stockId);
            // validate saleable qty,...
            this._productValidator.checkProductBeforeAddToCart(product, {
                productId: product.id,
                qty: input.qty,
                stockId: cartItem.stockId,
            });
            return { cartItem, input };
        };

    processing: UseCasePipeMethod<
        AdminUpdateItemUseCaseProcessingInput,
        AdminUpdateItemUseCaseProcessingOutput
    > = async ({ cartItem, input }) => {
        const userId = this.context.auth.authId!;
        // check cart enable, belong user before update item qty
        await this._repo.getById(cartItem.cartId, userId, false, false, true);
        if (input.qty > 0 || input.customPrice) {
            await this._repo.updateItem(cartItem, {
                qty: input.qty,
                customPrice: input.customPrice,
                isPlus: false,
            });
            return;
        }
        // remove item from cart when item qty = 0
        if (input.qty == 0) {
            await this._repo.deleteItem(cartItem.id, cartItem);
        }
    };

    map: UseCasePipeMethod<AdminUpdateItemUseCaseMapInput, AdminUpdateItemUseCaseMapOutput> = async () => {
        return;
    };
}
