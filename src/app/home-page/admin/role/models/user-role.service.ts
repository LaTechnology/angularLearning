import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Data } from './model';

@Injectable({
    providedIn: 'root'
})
export class UserRoleService {
    private apiUrl = 'http://localhost:3000/role';

    constructor(private http: HttpClient) { }

    saveUserRole(userRoleData: any): Observable<any> {
        return this.http.post(this.apiUrl, userRoleData);
    }

    getRole(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getUserById(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    updateUserRoles(userId: string, updatedData: any) {
        return this.http.put(`${this.apiUrl}/${userId}`, updatedData);
    }

    deleteRole(id: string): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete(url);
    }
}
