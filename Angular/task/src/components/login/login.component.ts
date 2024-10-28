import { HttpClient, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatSelectModule, MatCardModule, FormsModule],
  // providers:[provideHttpClient()],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,  private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log('Login successful', response);
  
          // Store user ID and token in localStorage
          localStorage.setItem('userId', response.userId); 
          localStorage.setItem('token', response.token);
  
          // Check the user role and navigate accordingly
          const role = response.role; // Assuming the response contains the role
          console.log("m,,,,,",role);
          if (role === 'Admin') {
            this.router.navigate(['/customers']); // Navigate to admin dashboard or customer component
          } else {
            this.router.navigate(['/product']); // Navigate to user dashboard or product page
          }
        },
        error: (error) => {
          console.error('Login error', error);
          // Capture the error message and display it
          if (error.status === 400) {
            this.errorMessage = 'Invalid email or password'; // Custom error message
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again later.';
          }
        }
      });
    }
  }
  
      // if(this.loginForm.value.role === "Admin"){
      //   console.log("Admin coming!!!");
      //   this.http.get('http://localhost:5000/api/auth/showuser', this.loginForm.value).subscribe({
      //     next:(response:any)=>{
      //       console.log('Login successful', response);
      //       localStorage.setItem('token',response.token);
      //       this.router.navigate(['/users']); // Navigate to another route on success
      //   },
      //   error: (error) => {
      //     console.error('Login error', error);
      //     // Capture the error message and display it
      //     if (error.status === 400) {
      //       this.errorMessage = 'Invalid email or password'; // Custom error message
      //     } else {
      //       this.errorMessage = 'An unexpected error occurred. Please try again later.';
      //     }
      //   }
      // }
      //   );
      // }
    }
  
