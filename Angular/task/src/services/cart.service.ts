import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:3000/api/cart'; 
  private cartItems: any[] = []; // Initialize an empty array for cart items

  constructor(private http: HttpClient) {
    this.loadCartItems();
  }

  addToCart(product: any): void {
    this.cartItems.push(product);
    this.saveCartItems();
  }


   // Function to add an item to the cart in the database
   addCartItem(userId: string, productId: number, quantity: number): Observable<any> {

    const cartItem = {
      userId: userId,
      productId: productId,
      quantity: quantity
    };

    console.log("cartItem",cartItem);
    // Make an HTTP POST request to add the cart item
    return this.http.post(`${this.baseUrl}/add`, cartItem);
  }
  
  updateCartItem(userId: string, id:number, quantity: number): Observable<any> {
    const body = { quantity,id };
    return this.http.put(`${this.baseUrl}/update/${userId}`, body);
  }
  
  getCartItems(): any[] {
    return this.cartItems;
  }

  saveCartItems(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  loadCartItems(): void {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      this.cartItems = JSON.parse(storedItems);
    }
  }

  clearCart(): void {
    this.cartItems = [];
    localStorage.removeItem('cartItems');
  }
}
