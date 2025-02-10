import * as AddressAction from './address.action'

//Load All Addresses

import { createReducer, on } from "@ngrx/store";
import { initialState } from "./address.state";
import { error } from 'console';
import { state } from '@angular/animations';

export const addressReducer = createReducer(
    initialState,

    on(AddressAction.loadAllAddressesSuccess,(state,{addresses})=>({
        ...state,
        addresses,
        loading:false,
        error:null
    })),
    on(AddressAction.loadAllAddressesFailure,(state,{error})=>({
        ...state,
        loading:false,
        error
    }))
);