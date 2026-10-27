
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  orders: any[] = [];
  isLoading = true;

  private apiUrl = 'https://localhost:7141/api/Orders';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to load orders.'
        });
        this.cdRef.detectChanges();
      }
    });
  }

  updateStatus(order: any): void {
    this.http.put(
      `${this.apiUrl}/${order.orderId}/status`,
      JSON.stringify(order.status),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Order #${order.orderId} status updated!`
        });
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error || 'Unable to update order status.'
        });
        this.loadOrders();
      }
    });
  }
}
