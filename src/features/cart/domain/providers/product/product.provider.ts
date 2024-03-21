import { IModuleConnector } from '@cbidigital/aqua/module';
import { Nullable, Provider, Scope } from '@cbidigital/heron-common';
import { IProductConnectorService } from '@cbidigital/inventory-module/connectors/product';
import { ProductGetOutput } from '@cbidigital/inventory-module/features/product/app/useCases';
import { lastValueFrom } from 'rxjs';
import { InjectTokens, ProviderTokens } from '../../../../../constants';
import { ProductChangeHoldingQuantityModelPayload } from '@cbidigital/inventory-module/features/product/app/useCases';
import { Autowired, NotSupportedError } from '@heronjs/common';

export interface IProductProvider {
    getProductById(id: string, stockId?: Nullable<string>): Promise<ProductGetOutput>;

    getListProductsByListIds(ids: string[], stockId?: Nullable<string>): Promise<ProductGetOutput[]>;

    getMapProductsByListIds(
        ids: string[],
        stockId?: Nullable<string>,
    ): Promise<Record<string, ProductGetOutput>>;

    changeListHoldingQty(itemQuantities: ProductChangeHoldingQuantityModelPayload[]): Promise<void>;
}

@Provider({ token: ProviderTokens.PRODUCT_PROVIDER, scope: Scope.SINGLETON })
export class ProductProvider implements IProductProvider {
    constructor(
        @Autowired(InjectTokens.PRODUCT_CONNECTOR)
        protected _productConnector: IModuleConnector<IProductConnectorService>,
    ) {
        if (!this._productConnector) throw new NotSupportedError('Please inject product connector');
    }

    async getProductById(id: string, stockId?: Nullable<string>): Promise<ProductGetOutput> {
        return lastValueFrom(
            this._productConnector.service.get({
                input: {
                    id,
                    stockId: stockId ?? undefined,
                },
            }),
        );
    }

    async getListProductsByListIds(ids: string[], stockId?: Nullable<string>): Promise<ProductGetOutput[]> {
        return lastValueFrom(
            this._productConnector.service.getPaginatedList({
                input: {
                    filter: {
                        id: {
                            in: ids,
                        },
                    },
                    limit: ids.length,
                    stockId: stockId ?? undefined,
                },
            }),
        );
    }

    async getMapProductsByListIds(
        ids: string[],
        stockId?: Nullable<string>,
    ): Promise<Record<string, ProductGetOutput>> {
        const products = await this.getListProductsByListIds(ids, stockId);
        const result: Record<string, ProductGetOutput> = {};
        products.forEach((product) => (result[product.id] = product));
        return result;
    }

    async changeListHoldingQty(itemQuantities: ProductChangeHoldingQuantityModelPayload[]): Promise<void> {
        return lastValueFrom(
            this._productConnector.service.changeListHoldingQuantity({
                input: {
                    checkAvailable: true,
                    items: itemQuantities,
                },
            }),
        );
    }
}
