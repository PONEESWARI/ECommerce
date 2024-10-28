import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card'; // Import MatCardModule
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule], // Add MatIconModule
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems: any[] = [];

  constructor(private router: Router, private cartService:CartService) {}

  ngOnInit(): void {
    this.loadCartItems(); // Load cart items on component initialization
  }

  // Load cart items from localStorage
  loadCartItems(): void {
    const storedItems = localStorage.getItem('cart');
    if (storedItems) {
      this.cartItems = JSON.parse(storedItems); // Parse the stored cart items
    }
  }

  // Calculate total cart amount
  getTotalAmount(): number {
    return this.cartItems.reduce((price, item) => price + item.quantity * item.price, 0);
  }

  // Increase item quantity
  increaseQuantity(item: any): void {
    item.quantity++;
    this.updateLocalStorage(); // Update localStorage after modifying quantity
    this.updateCartInDatabase(item); 
  }

  // Decrease item quantity
  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateLocalStorage(); // Update localStorage after modifying quantity
      this.updateCartInDatabase(item); 
    }
    }

      // Call the CartService to update the item quantity in the database
  updateCartInDatabase(item: any): void {
    const userId = localStorage.getItem('userId') || ''; // Retrieve the user ID from localStorage
    console.log("itemmmm",item);
    this.cartService.updateCartItem(userId, item.id, item.quantity).subscribe({
      next: (response) => {
        console.log('Cart item updated in database successfully', response);
      },
      error: (error) => {
        console.error('Error updating item in cart database', error);
      }
    });
  }

  

  // Remove item from cart
  removeItem(item: any): void {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1); // Remove the item from cartItems array
      this.updateLocalStorage(); // Update localStorage after removing the item
    }
  }

  // Update localStorage with modified cart items
  updateLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems))
    
  }

  // Proceed to checkout
  goToCheckout(): void {
    this.router.navigate(['/checkout']); // Navigate to checkout page
  }
}