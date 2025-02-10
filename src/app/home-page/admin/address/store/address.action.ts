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