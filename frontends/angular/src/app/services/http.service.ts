import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, catchError } from 'rxjs';
import { environment } from './../../environments/environment';
import { LoginUser, RegisterUser } from '../interfaces/api';
import { Router } from '@angular/router';
const BACKEND_URL = environment.apiBaseUrl;

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private loggedInUserSubject: BehaviorSubject<RegisterUser | null> =
    new BehaviorSubject<RegisterUser | null>(null);
  public loggedInUser$: Observable<RegisterUser | null> =
    new Observable<RegisterUser | null>();

  constructor(private http: HttpClient, private router: Router) {
    const savedUser = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null;
    this.loggedInUserSubject = new BehaviorSubject<RegisterUser | null>(
      savedUser
    );
    this.loggedInUser$ = this.loggedInUserSubject.asObservable();
    if (localStorage.getItem('token')) {
      this.getUserDetails();
    }
  }

  logoutUser(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.loggedInUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  registerUser({ email, password }: RegisterUser): Observable<any> {
    console.log(email, password);
    return this.http.post(`${BACKEND_URL}/auth/register`, {
      email,
      password,
    });
  }

  loginUser({ email, password }: LoginUser): Observable<any> {
    return this.http.post(`${BACKEND_URL}/auth/login`, {
      email,
      password,
    });
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }

    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
  getUserDetails(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    try {
      this.http
        .get(`${BACKEND_URL}/auth/me`, {
          headers: headers,
        })
        .pipe(catchError(this.handleError))
        .subscribe((data: any) => {
          console.log('getuserdetails', data);
          this.loggedInUserSubject.next(data.user as RegisterUser);
          //@ts-ignore
          localStorage.setItem('user', JSON.stringify(data.user));
          const savedUser = localStorage.getItem('user')
            ? JSON.parse(localStorage.getItem('user')!)
            : null;
          this.loggedInUserSubject = new BehaviorSubject<RegisterUser | null>(
            savedUser
          );
          this.loggedInUser$ = this.loggedInUserSubject.asObservable();
        });
    } catch (error) {
      console.log(error);
      console.log('error occured');
    }
  }
}
