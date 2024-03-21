import { UpdateItemQtyUseCase } from './update-item-qty.usecase';
import { UseCaseTokens } from '../../../../../../constants';
import { Provider, Scope } from '@heronjs/common';
import { UseCasePipeMethod } from '@cbidigital/aqua';
import { UpdateItemQtyUseCaseProcessingInput, UpdateItemQtyUseCaseProcessingOutput } from './types';

@Provider({ token: UseCaseTokens.ADMIN_UPDATE_ITEM_QTY, scope: Scope.REQUEST })
export class AdminUpdateItemQtyUseCase extends UpdateItemQtyUseCase {
    override processing: UseCasePipeMethod<
        UpdateItemQtyUseCaseProcessingInput,
        UpdateItemQtyUseCaseProcessingOutput
    > = async (input) => {
        const userId = this.context.auth.authId!;
        const cartItem = input.cartItem;
        // check cart enable, belong user before update item qty
        await this._repo.getById(cartItem.cartId, userId, false, false, true);
        if (input.qty > 0) {
            await this._repo.updateItem(cartItem, { qty: input.qty, isPlus: false });
            return;
        }
        // remove item from cart when item qty = 0
        if (input.qty == 0) {
            await this._repo.deleteItem(cartItem.id, cartItem);
        }
    };
}
