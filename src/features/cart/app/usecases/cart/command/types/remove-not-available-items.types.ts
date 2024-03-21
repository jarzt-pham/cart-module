import { AuthInput } from '@cbidigital/aqua/usecase';

export type RemoveNotAvailableItemsUseCaseInput = void;

export type RemoveNotAvailableItemsUseCaseOutput = void;

export type RemoveNotAvailableItemsUseCaseContext = {
    firstInput: RemoveNotAvailableItemsUseCaseInput;
    auth: AuthInput;
};

export type RemoveNotAvailableItemsUseCaseValidateInput = RemoveNotAvailableItemsUseCaseInput;
export type RemoveNotAvailableItemsUseCaseValidateOutput = RemoveNotAvailableItemsUseCaseInput;

export type RemoveNotAvailableItemsUseCaseProcessingInput = RemoveNotAvailableItemsUseCaseValidateOutput;
export type RemoveNotAvailableItemsUseCaseProcessingOutput = void;

export type RemoveNotAvailableItemsUseCaseMapInput = void;
export type RemoveNotAvailableItemsUseCaseMapOutput = void;
