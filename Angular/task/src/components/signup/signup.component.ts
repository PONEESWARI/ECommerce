import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, AsyncValidatorFn, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { map, debounceTime, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatSelectModule, MatCardModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'] // Corrected the property name here
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email], [this.emailAsyncValidator()]],
      mobile: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$'),
        Validators.minLength(10), // Must be exactly 10 digits
        this.mobileNumberValidator() // Custom validator
      ], [this.mobileAsyncValidator()]], // Async validator
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', Validators.required]
    });
  }
 // Prevent non-numeric characters from being typed
 isNumberKey(event: KeyboardEvent): boolean {
  const charCode = event.charCode;
  // Allow only numeric input (0-9) and control characters (backspace, delete, etc.)
  return (charCode >= 48 && charCode <= 57) || charCode === 8 || charCode === 0;
}

  // Async validator for checking if the email is taken
  emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return control.value ? this.authService.isEmailTaken(control.value).pipe(
        debounceTime(300),
        map(isTaken => (isTaken ? { emailTaken: true } : null)),
        catchError(() => of(null))
      ) : of(null);
    };
  }

  // Async validator for checking if the mobile number is taken
  mobileAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return control.value ? this.authService.isMobileTaken(control.value).pipe(
        debounceTime(300),
        map(isTaken => (isTaken ? { mobileTaken: true } : null)),
        catchError(() => of(null))
      ) : of(null);
    };
  }

  // Custom validator for mobile number
  mobileNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      // Check if the value is numeric (only digits)
      const isValid = /^[0-9]*$/.test(value); 
      return isValid ? null : { invalidMobile: true };
    };
  }

  // Submit form
  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Form Submitted', this.signupForm.value);
      this.authService.signup(this.signupForm.value).subscribe({
        next: (response) => {
          console.log('Signup successful', response);
          this.route.navigate(['login']); // Navigate to login page upon successful signup
        },
        error: (error) => {
          console.error('Signup error', error);
        }
      });
    }
  }

  // Navigate to login page
  loginpage() {
    this.route.navigate(['login']);
  }
}
