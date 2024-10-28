import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { v4 as uuidv4 } from 'uuid';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatRadioModule
  ],
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {
  cartItems: any[] = [];  // Cart items loaded from local storage
  checkoutForm: FormGroup; // Form for shipping information

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService:ProductService
  ) {
    // Initialize the form group with validation
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]] ,
      paymentMethod: ['cash']  // default to "cash"// Validate Postal Code (e.g., 5 digits)
    });
  }

  ngOnInit(): void {
    this.loadCartItems();  // Load cart items when the component is initialized
  }

  // Load the cart items from local storage
  loadCartItems(): void {
    const storedItems = localStorage.getItem('cart');
    if (storedItems) {
      this.cartItems = JSON.parse(storedItems);
      console.log("Loaded cart items:", this.cartItems);
    }
  }

  // Method to calculate the total amount for the cart items
  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
  }
  
  // Method to handle form submission (placing an order)
  onSubmit(): void {
    if (this.checkoutForm.valid) {
      const userId = localStorage.getItem('userId') || ''; 
      const orderSummary = {
        orderId: uuidv4(), 
        items: this.cartItems, // All cart items
        totalAmount: this.getTotalAmount(), // Total amount calculated
        shippingDetails: this.checkoutForm.value, // Shipping info from the form
        paymentMethod: 'Cash' ,// Hardcoded for now (can be extended to support multiple methods)
        orderDate: new Date(),
        userId:userId
      };

      // Save the order summary to local storage (for later use or summary display)
      localStorage.setItem('orderSummary', JSON.stringify(orderSummary));
      this.productService.createOrder(orderSummary).subscribe({
        next: (response) => {
          // Order created successfully, navigate to the order summary page
          localStorage.removeItem('cart'); // Clear cart after order
          this.router.navigate(['/order-summary']);
        },
        error: (error) => {
          console.error('Error creating order', error);
          // Handle error, e.g., show an error message to the user
        },
        complete: () => {
          // Optional: any additional logic after order creation is complete
          console.log('Order creation process complete');
        }
      });

      
    }
      
      // Remove the cart from local storage since the order is placed
      localStorage.removeItem('cart');

      // Navigate to an order summary page or confirmation page
      this.router.navigate(['/order-summary']);
    }
  

  // New method to navigate back to the cart page
  goBack(): void {
    this.router.navigate(['/cart']);  // Adjust this route according to your app's routing
  }
}
