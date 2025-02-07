import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './product.model';
import { environment } from 'environments/environment.development';
import { ApiService } from 'app/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private apiService: ApiService) {}

  getProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>(this.apiUrl);
  }

  addProduct(newProduct: Product): Observable<Product> {
    return this.apiService.post<Product>(this.apiUrl, newProduct);
  }

  getProductById(id: number): Observable<Product> {
    return this.apiService.get<Product>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: number, updatedProduct: Product): Observable<Product> {
    return this.apiService.put<Product>(`${this.apiUrl}/${id}`, updatedProduct);
  }

  deleteProduct(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.apiUrl}/${id}`);
  }
}
