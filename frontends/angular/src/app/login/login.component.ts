import { Component } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
import { RegisterUser } from '../interfaces/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  registerUser: RegisterUser = {
    email: '',
    password: '',
  };
  errorMessage: string | null = null;

  constructor(private httpService: HttpService, private router: Router) {}

  onLoginFormSubmit(): void {
    this.httpService.loginUser(this.registerUser).subscribe(
      (response: any) => {
        console.log('Registration successful:', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user.user));
        // Navigate to a different page if necessary
        this.router.navigate(['/dashboard']);
      },
      (error: any) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Login failed. Please try again.';
      }
    );
  }
}
