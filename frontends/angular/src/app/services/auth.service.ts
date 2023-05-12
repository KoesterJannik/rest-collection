import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  // Save the JWT token to local storage
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Retrieve the JWT token from local storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Remove the JWT token from local storage
  removeToken(): void {
    localStorage.removeItem('token');
  }

  // Check if the user is logged in (JWT token is set)
  isLoggedIn(): boolean {
    const token = this.getToken();
    console.log(token);
    return token !== null;
  }
}
