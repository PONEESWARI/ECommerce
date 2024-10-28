import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {

  orderSummary: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadOrderSummary(); // Load order summary on component initialization
  }

  // Load the order summary from localStorage
  loadOrderSummary(): void {
    const storedOrder = localStorage.getItem('orderSummary');
    if (storedOrder) {
      this.orderSummary = JSON.parse(storedOrder); // Parse the stored order summary
    }
  }

    // Navigate back to product list page
    goToProductList(): void {
      this.router.navigate(['/product']);
    }
}
