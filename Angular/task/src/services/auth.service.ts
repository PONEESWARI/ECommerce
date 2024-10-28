import { Injectable } from '@angular/core';
import { HttpClient ,HttpParams} from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { map,catchError} from 'rxjs/operators';
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/api/auth';  // Adjust the URL based on your backend

  constructor(private http: HttpClient) {}

  // Method to handle user login
  login(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, user);
  }
// Method to handle user signup
signup(user: User): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/signup`, user);
}
isEmailTaken(email: string): Observable<boolean> {
  return this.http.get<{ exists: boolean }>(`${this.baseUrl}/check-email?email=${email}`).pipe(
    map(response => response.exists), // Adjust based on your actual response structure
    catchError(() => of(false)) // If an error occurs, return false
  );
}


// Check if mobile exists
isMobileTaken(mobile: string): Observable<boolean> {
  return this.http.get<boolean>(`${this.baseUrl}/check-mobile?mobile=${mobile}`).pipe(
    map((response: boolean) => response)
  );
}

  // Method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');  // Returns true if token is present
  }

  // Method to log out the user
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');  // Optionally clear cart data on logout
  }

  // Method to retrieve the JWT token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
// In your AuthService
getUsers(role: string): Observable<any[]> {
  // Use HttpParams to add the role as a query parameter
  const params = new HttpParams().set('role', role);
  return this.http.get<any[]>(`${this.baseUrl}/users`, { params }); // Corrected URL formatting
}

  
}
