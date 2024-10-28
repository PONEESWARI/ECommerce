import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatGridListModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  products: any[] = [];
  displayedColumns: string[] = ['name', 'image', 'description', 'originalPrice', 'discountPrice', 'sellingPrice', 'hsnCode', 'actions'];
  isGridView: boolean = true; // Initialize to true for grid view

  constructor(private productService: ProductService, private cartService: CartService, private route: Router, private snackBar: MatSnackBar,private router: Router) {}

  ngOnInit(): void {
    this.loadProducts(); 
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

//   addToCart(product: any): void {
//     let cart = JSON.parse(localStorage.getItem('cart') || '[]');
//     const cartItem = {
//       id: product.id,
//       name: product.name,
//       price: product.sellingPrice,
//       quantity: product.quantity
//     };
//       cart.push(cartItem);    
//     console.log(cart,"cart");
//     localStorage.setItem('cart', JSON.stringify(cart));
//     this.snackBar.open(`${product.name} has been added to your cart!`, 'Close', { 
//       duration: 3000 
//     });
// }
addToCart(product: any): void {
  console.log(product);
  // Retrieve the cart from localStorage, or initialize it as an empty array if not present
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // Create the cart item object with the necessary details
  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.sellingPrice,
    quantity: 1, // Initialize quantity to 1
  };
 console.log("poo",product.id);
  // Check if the product already exists in the cart
  const existingProduct = cart.find((item: any) => item.id === cartItem.id);

  // If the product already exists, increase its quantity
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    // If the product is not in the cart, add it to the array
    cart.push(cartItem);
  }

  console.log(cart, "cart");
  // Update localStorage with the updated cart array
  localStorage.setItem('cart', JSON.stringify(cart));

  // Store the cart item in the database
  // const userId = 'exampleUserId'; // Replace with the actual logged-in user's ID

  const userId = localStorage.getItem('userId') || ''; // Provide a default value

  this.cartService.addCartItem(userId, product.id, cartItem.quantity).subscribe({
    next: (response) => {
      // Notify the user that the item was added to the cart
      this.snackBar.open(`${product.name} has been added to your cart!`, 'Close', { 
        duration: 3000 
      });
    },
    error: (error) => {
      console.error('Error adding item to cart in database', error);
      this.snackBar.open('Failed to add item to cart in database.', 'Close', { 
        duration: 3000 
      });
    }
  }); 
}
  goToCheckout(): void {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  
    if (cartItems.length > 0) {
      this.route.navigate(['cart']); // Navigate to cart page
    } else {
      alert('Please add a product to the cart before proceeding to checkout.');
    }
  }

  toggleView(): void {
    this.isGridView = !this.isGridView; // Toggle the view state
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }
}
