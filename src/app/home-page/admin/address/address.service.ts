import { Injectable } from '@angular/core';
import { Address } from './address.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl: string = 'http://localhost:3000/addresses';
  // private addresses: Address[] = [];
  constructor(private http: HttpClient) { }

  // addAddress(address:Address){
  //   this.addresses.push(address);
  //   this.save();
  // }

  // getAllAddresses():Address[]{
  //   const addresses = localStorage.getItem('addresses');
  //   if(addresses){
  //     return JSON.parse(addresses);
  //   }
  //   else{
  //     return [];
  //   }
  // }

  // getAddressById(id:string):Address | undefined{
  //   const addresses = this.getAllAddresses();
  //   return addresses.find(a=>a.addressId===id);
  // }

  // updateAddress(updateAddress:Address){
  //   console.log("Updating Address:",updateAddress);
  //   const index = this.addresses.findIndex(a=>a.addressId === updateAddress.addressId);
  //   if(index !== -1){
  //     this.addresses[index] = updateAddress;
  //     this.save();
  //   }
  //   else{
  //     console.log("Address not found");
  //   }
  // }


  // private save(){
  //   const existingAddresses = JSON.parse(localStorage.getItem('addresses') || '[]');
  //   existingAddresses.push(...this.addresses);
  //   localStorage.setItem('addresses',JSON.stringify(existingAddresses));
  // }

  addAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(this.apiUrl, address);
  }

  updateAddress(id:string ,address: Address): Observable<Address> {
    // Assuming the address has an id and you're using it for PUT request
    console.log(id);
    console.log("updating address => ",address)
    const url = `${this.apiUrl}/${id}`; // Construct the API URL with addressId
    return this.http.put<Address>(url, address);
  }


  getAddressById(id:string):Observable<Address>{
    const url:string = `http://localhost:3000/addresses/${id}`;
    console.log(url);
    console.log("response data => ",this.http.get<Address>(url));
    return this.http.get<Address>(url);
  }
  
  getAllAddresses():Observable<Address[]>{
    return this.http.get<Address[]>(this.apiUrl);
  }

  deleteAddressById(id:string):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
