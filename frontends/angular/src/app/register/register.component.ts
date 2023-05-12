// register.component.ts
import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { RegisterUser } from '../interfaces/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerUser: RegisterUser = {
    email: '',
    password: '',
  };
  errorMessage: string | null = null;

  constructor(private httpService: HttpService, private router: Router) {}

  onRegisterFormSubmit(): void {
    this.httpService.registerUser(this.registerUser).subscribe(
      (response: any) => {
        console.log('Registration successful:', response);
        localStorage.setItem('token', response.token);
        console.log(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        // Navigate to a different page if necessary
        this.router.navigate(['/dashboard']);
      },
      (error: any) => {
        console.error('Registration failed:', error);
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }
}
