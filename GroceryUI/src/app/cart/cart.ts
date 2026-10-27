
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {HttpClient} from '@angular/common/http';
import {RouterLink} from '@angular/router';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ToastModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cartItems: any[] = [];
  isLoading = true;

  constructor(
    private cartService: CartService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;

    this.cartService.getCartItems().subscribe({
      next: (data) => {
        this.cartItems = data;
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });
  }
  getTotal(): number {
  return this.cartItems.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);
}
removeItem(cartItemId: number): void {
  this.cartService.removeCartItem(cartItemId).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item removed from cart!'
      });

      this.loadCart();
    },
    error: (error) => {
      console.error('Error removing item:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unable to remove item from cart.'
      });
    }
  });
}
placeOrder(): void {
  this.http.post<any>('https://localhost:7141/api/Orders', {}).subscribe({
    next: (response) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Order Placed',
        detail: `Order #${response.orderId} placed successfully! Total: ₹${response.totalAmount}`
      });

      this.loadCart();
    },
    error: (error) => {
      console.error('Error placing order:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Order Failed',
        detail: error.error || 'Unable to place order.'
      });
    }
  });
}
}
