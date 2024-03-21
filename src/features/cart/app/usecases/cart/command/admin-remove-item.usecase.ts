import { RemoveItemUseCase } from './remove-item.usecase';
import { UseCaseTokens } from '../../../../../../constants';
import { Provider, Scope } from '@heronjs/common';
import { UseCasePipeMethod } from '@cbidigital/aqua';
import { RemoveItemUseCaseProcessingInput, RemoveItemUseCaseProcessingOutput } from './types';

@Provider({ token: UseCaseTokens.ADMIN_REMOVE_ITEM, scope: Scope.REQUEST })
export class AdminRemoveItemUseCase extends RemoveItemUseCase {
    override processing: UseCasePipeMethod<
        RemoveItemUseCaseProcessingInput,
        RemoveItemUseCaseProcessingOutput
    > = async (input) => {
        const userId = this.context.auth.authId!;
        const cartItem = await this._repo.getItemById(input.itemId, true);
        const cart = await this._repo.getById(cartItem.cartId, userId, false, false, true);
        if (cart) await this._repo.deleteItem(cartItem.id, cartItem);
        return;
    };
}
