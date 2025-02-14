import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiUrl:string = 'http://localhost:3000/locations';
  constructor(private apiService:ApiService) {

  }

  addLocation(location:Location):Observable<Location>{
    return this.apiService.post<Location>(this.apiUrl,location);
  }

  getAllLocations():Observable<Location[]>{
    return this.apiService.get<Location[]>(this.apiUrl);
  }

  updateLocation(id:string,location:Location):Observable<Location>{
    const url= `${this.apiUrl}/${id}`;
    return this.apiService.put<Location>(url,location);
  }

  getLocationById(id:string):Observable<Location>{
    const url= `${this.apiUrl}/${id}`;
    return this.apiService.get<Location>(url);
  }

  deleteLocationById(id:string):Observable<void>{
    const url= `${this.apiUrl}/${id}`;
    return this.apiService.delete(url);
  }
}
