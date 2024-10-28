import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  orders: any[] = []; // Using `any[]` to handle raw data

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.fetchOrders(userId);
    }
  }

  fetchOrders(userId: string): void {
    this.orderService.getOrdersByUserId(userId).subscribe({
      next: (data: any[]) => {
        this.orders = data; // Correctly assign the data to orders
        console.log("order",this.orders);
      },
      error: (error) => { // Use 'error' as a named callback
        console.error('Error fetching orders:', error);
      }
    });
  }
  
  //     (data: any[]) => { // Expecting an array of raw order data
  //       this.orders = data;
  //     },
  //     (error) => {
  //       console.error('Error fetching orders:', error);
  //     }
  //   );
  // }

    // Navigate back to product list page
    goToProductList(): void {
      this.router.navigate(['/product']);
    }

}
