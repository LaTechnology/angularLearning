import { Address } from "../address.model";

export interface AddressState{
    addresses:Address[];
    loading:boolean;
    error:string|null;
}

export const initialState:AddressState={
    addresses:[],
    loading:false,
    error:null
}