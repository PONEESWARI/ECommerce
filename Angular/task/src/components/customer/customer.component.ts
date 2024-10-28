import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {
  users: any[] = []; // Array to hold user data (without using a model)
  errorMessage: string = ''; // To hold error messages

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

// In your component
fetchUsers(): void {
  // Assuming you have a way to determine the user's role, e.g., from localStorage
  const role = localStorage.getItem('role') || 'Admin'; // Default to 'Admin' if not found

  this.authService.getUsers(role).subscribe({
    next: (data: any[]) => {
      this.users = data; // Store fetched users
    },
    error: (error) => {
      console.error('Error fetching users:', error);
      this.errorMessage = 'Could not load users. Please try again later.';
    }
  });
}
}
