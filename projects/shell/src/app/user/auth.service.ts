import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User;
  redirectUrl: string;

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  // Contrived example for POC
  logIn(userName: string, password: string): void {
    if(!userName || !password) {
      return;
    }
    this.currentUser = {
      id: 1,
      userName
    }
  }

  logout(): void {
    this.currentUser = null;
  }
}
