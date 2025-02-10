import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { client } from "../home-page/admin/client/client.model";
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  private apiUrl = `${environment.apiUrl}/user`;
  constructor(private apiService: ApiService) {}

  public triggerSubject = new Subject<void>();

  // Observable for parent to listen
  trigger$ = this.triggerSubject.asObservable();

  addClient(client: client): Observable<client> {
    return this.apiService.post<client>(this.apiUrl, client);
  }

  updateClient(id: string,client: client): Observable<client> {
    return this.apiService.put<client>( `${this.apiUrl}/${id}`,client);
  }

  getAllClients(): Observable<client[]> {
    return this.apiService.get<client[]>(this.apiUrl);
  }

  getClientById(id: string): Observable<client> {
    return this.apiService.get<client>(`${this.apiUrl}/${id}`);
  }

  getSelectedClientById(ids: number[]): Observable<any[]> {
    const query = ids.map(id => `id=${id}`).join('&');
    return this.apiService.get<any[]>(`${this.apiUrl}?${query}`);
  }

  deleteClient(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.apiUrl}/${id}`);
  }
}
