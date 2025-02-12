import { Address } from "../address.model";

export interface AddressState{
    addresses:Address[];
    address:Address | null;
    loading:boolean;
    error:string|null;
}

export const initialState:AddressState={
    addresses:[],
    address: null,
    loading:false,
    error:null
}