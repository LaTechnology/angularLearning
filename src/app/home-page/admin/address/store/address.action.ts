import { createAction, props } from "@ngrx/store";
import { Address } from "../address.model";

export const loadAllAddresses = createAction('[Address] Load All Addresses');

export const loadAllAddressesSuccess = createAction(
    '[Address] Load All Addresses Success',
    props<{addresses: Address[]}>()
);

export const loadAllAddressesFailure = createAction(
    '[Address] Load All Addresses Failure',
    props<{error:string}>()
);

export const loadAddressById = createAction(
    '[Address] Load Address By ID',
    props<{id:string}>()
);

export const loadAddressByIdSuccess = createAction(
    '[Address] Load Address By ID Success',
    props<{address:Address}>()   
);

export const loadAddressByIdFailure = createAction(
    '[Address] Load Address By ID Failure',
    props<{error:string}>()
);