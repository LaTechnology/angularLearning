import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { Product } from './product.model';
import { environment } from 'environments/environment.development';
import { ApiService } from 'app/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private apiUrl1 = `${environment.apiUrl}/locations`;
  constructor(private apiService: ApiService) {}

  public triggerSubject = new Subject<void>();

  // Observable for parent to listen
  trigger$ = this.triggerSubject.asObservable();

  getProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>(this.apiUrl);
  }

  addProduct(newProduct: Product): Observable<Product> {
    return this.apiService.post<Product>(this.apiUrl, newProduct);
  }

  getSelectedProductById(ids: string[]): Observable<Product[]> {
    return this.apiService
      .get<any[]>(`${this.apiUrl}`)
      .pipe(
        map((product) =>
          product.filter((user) => ids.some((id) => user.id.includes(id)))
        )
      );
  }

  getProductById(id: number): Observable<Product> {
    return this.apiService.get<Product>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: string, updatedProduct: Product): Observable<Product> {
    return this.apiService.put<Product>(`${this.apiUrl}/${id}`, updatedProduct);
  }

  deleteProduct(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.apiUrl}/${id}`);
  }

  
 getAllLocation():Observable<Product[]> {
  return this.apiService.get<any[]>(this.apiUrl1);
 }
}
