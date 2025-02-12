import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AddressState } from "./address.state";


export const selectAddressState = createFeatureSelector<AddressState>('addresses');

export const selectAllAddresses = createSelector(
    selectAddressState,
    (state)=> state.addresses
);

export const selectAddressError = createSelector(
    selectAddressState,
    (state)=>state.error
);

export const selectAddressById = (id:string)=>
    createSelector(selectAddressState,(state)=>
        state.addresses.find(address => address.id === id) || undefined
    );
