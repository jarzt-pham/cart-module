import { IUseCase, UseCase, UseCasePipeMethod, ValidatorUtil } from '@cbidigital/aqua';
import { Inject, Provider, Scope } from '@heronjs/common';
import { ProviderTokens, RepoTokens, UseCaseTokens } from '../../../../../../constants';
import {
    GetItemByProductIdUseCaseContext,
    GetItemByProductIdUseCaseInput,
    GetItemByProductIdUseCaseInputModel,
    GetItemByProductIdUseCaseMapInput,
    GetItemByProductIdUseCaseMapOutput,
    GetItemByProductIdUseCaseOutput,
    GetItemByProductIdUseCaseProcessingInput,
    GetItemByProductIdUseCaseProcessingOutput,
    GetItemByProductIdUseCaseValidateInput,
    GetItemByProductIdUseCaseValidateOutput,
} from './types';
import { ICartRepo } from '../../../../domain/repos';
import { IProductProvider } from '../../../../domain/providers/product';

export type IGetItemByProductIdUseCase = IUseCase<
    GetItemByProductIdUseCaseInput,
    GetItemByProductIdUseCaseOutput,
    GetItemByProductIdUseCaseContext
>;

@Provider({ token: UseCaseTokens.GET_ITEM_BY_PRODUCT_ID, scope: Scope.REQUEST })
export class GetItemByProductIdUseCase
    extends UseCase<
        GetItemByProductIdUseCaseInput,
        GetItemByProductIdUseCaseOutput,
        GetItemByProductIdUseCaseContext
    >
    implements IGetItemByProductIdUseCase
{
    constructor(
        @Inject(RepoTokens.CART) protected readonly _repo: ICartRepo,
        @Inject(ProviderTokens.PRODUCT_PROVIDER) private _productProvider: IProductProvider,
    ) {
        super();
        this.setMethods([this.validate, this.processing, this.map]);
    }

    validate: UseCasePipeMethod<
        GetItemByProductIdUseCaseValidateInput,
        GetItemByProductIdUseCaseValidateOutput
    > = async (input) => {
        return await ValidatorUtil.validatePlain<GetItemByProductIdUseCaseInput>(
            GetItemByProductIdUseCaseInputModel,
            input,
        );
    };

    processing: UseCasePipeMethod<
        GetItemByProductIdUseCaseProcessingInput,
        GetItemByProductIdUseCaseProcessingOutput
    > = async (input) => {
        const product = await this._productProvider.getProductById(input.productId, input.stockId);
        const cart = await this._repo.getActiveForUser(this.context.auth.authId!, product.targetId);
        if (cart) {
            return await this._repo.getItemByProductId(cart.id, product.id);
        } else {
            return;
        }
    };

    map: UseCasePipeMethod<GetItemByProductIdUseCaseMapInput, GetItemByProductIdUseCaseMapOutput> = async (
        input,
    ) => {
        return input;
    };
}
