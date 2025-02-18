import { Address } from "../address/address.model";


export interface Location{
    id:string;
    name:string;
    billingAddress:Address;
    shippingAddress:Address;
}