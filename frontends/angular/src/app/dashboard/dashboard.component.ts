import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { RegisterUser } from '../interfaces/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  loggedInUser: RegisterUser | null = null;

  constructor(private httpService: HttpService, public Router: Router) {}
  ngOnInit(): void {
    this.httpService.loggedInUser$.subscribe((user: any) => {
      console.log(user);
      this.loggedInUser = user;
    });
  }
}
