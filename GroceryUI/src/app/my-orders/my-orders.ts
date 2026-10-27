
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../services/orders';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrders implements OnInit {

  orders: any[] = [];
  isLoading = true;

  constructor(
    private ordersService: OrdersService,
    private cdRef: ChangeDetectorRef
  ) {}

  
ngOnInit(): void {
  this.ordersService.getOrders().subscribe({
    next: (data) => {
      this.orders = data;
      this.isLoading = false;
      this.cdRef.detectChanges();

      this.orders.forEach((order) => {
        this.ordersService.getOrderDetails(order.orderId).subscribe({
          next: (details) => {
            order.items = details.items || [];
            this.cdRef.detectChanges();
          },
          error: (error) => {
            console.error(
              'Error loading order details:',
              order.orderId,
              error
            );
          }
        });
      });
    },
    error: (error) => {
      console.error('Error loading orders:', error);
      this.isLoading = false;
      this.cdRef.detectChanges();
    }
  });
}

  
getOrderItems(order: any): any[] {
  return order.items || [];
}

}
