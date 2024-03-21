import { Inject, Provider, Scope } from '@heronjs/common';
import { CartTokens, ProviderTokens, RepoTokens, UseCaseTokens } from '../../../../../../constants';
import {
    UpdateItemQtyUseCaseInput,
    UpdateItemQtyUseCaseOutput,
    UpdateItemQtyUseCaseContext,
    UpdateItemQtyUseCaseInputModel,
    UpdateItemQtyUseCaseMapInput,
    UpdateItemQtyUseCaseMapOutput,
    UpdateItemQtyUseCaseProcessingInput,
    UpdateItemQtyUseCaseProcessingOutput,
    UpdateItemQtyUseCaseValidateInput,
    UpdateItemQtyUseCaseValidateOutput,
} from './types';
import { IUseCase, UseCase, UseCasePipeMethod, ValidatorUtil } from '@cbidigital/aqua';
import { ICartRepo } from '../../../../domain/repos';
import { IProductProvider } from '../../../../domain/providers/product';
import { IProductValidator } from '../../../../domain/utils/validator/product';

export type IUpdateItemQtyUseCase = IUseCase<
    UpdateItemQtyUseCaseInput,
    UpdateItemQtyUseCaseOutput,
    UpdateItemQtyUseCaseContext
>;

@Provider({ token: UseCaseTokens.UPDATE_ITEM_QTY, scope: Scope.REQUEST })
export class UpdateItemQtyUseCase
    extends UseCase<UpdateItemQtyUseCaseInput, UpdateItemQtyUseCaseOutput, UpdateItemQtyUseCaseContext>
    implements IUpdateItemQtyUseCase
{
    constructor(
        @Inject(RepoTokens.CART) protected readonly _repo: ICartRepo,
        @Inject(ProviderTokens.PRODUCT_PROVIDER) private _productProvider: IProductProvider,
        @Inject(CartTokens.PRODUCT_VALIDATOR) private _productValidator: IProductValidator,
    ) {
        super();
        this.setMethods([this.validate, this.processing, this.map]);
    }

    validate: UseCasePipeMethod<UpdateItemQtyUseCaseValidateInput, UpdateItemQtyUseCaseValidateOutput> =
        async (input) => {
            await ValidatorUtil.validatePlain<UpdateItemQtyUseCaseInput>(
                UpdateItemQtyUseCaseInputModel,
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
            return { cartItem, qty: input.qty };
        };

    processing: UseCasePipeMethod<UpdateItemQtyUseCaseProcessingInput, UpdateItemQtyUseCaseProcessingOutput> =
        async (input) => {
            const userId = this.context.auth.authId!;
            const cartItem = input.cartItem;
            // check cart enable, belong user before update item qty
            await this._repo.getById(cartItem.cartId, userId);
            if (input.qty > 0) {
                await this._repo.updateItem(cartItem, { qty: input.qty, isPlus: false });
                return;
            }
            // remove item from cart when item qty = 0
            if (input.qty == 0) {
                await this._repo.deleteItem(cartItem.id, cartItem);
            }
        };

    map: UseCasePipeMethod<UpdateItemQtyUseCaseMapInput, UpdateItemQtyUseCaseMapOutput> = async () => {
        return;
    };
}
