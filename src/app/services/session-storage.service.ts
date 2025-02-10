import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  getItem(key: string) {
    try {
      const result = JSON.parse(sessionStorage.getItem(key) || '{}');
      return result;

    } catch (error: any) {
      console.log(error);
    }
  }

  setItem(key: string, value: string | any) {
    try {
      return sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  }

  removeItem(key: string) {
    try {
      return sessionStorage.removeItem(key);
    } catch (error) {
      console.log(error);

    }
  }

  clearEntireSession() {
    sessionStorage.clear();
  }

}