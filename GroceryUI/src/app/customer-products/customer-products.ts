
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product';
import { CartService } from '../services/cart';
import { ChangeDetectorRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-customer-products',
  standalone: true,
  imports: [CommonModule, ToastModule],
  templateUrl: './customer-products.html',
  styleUrl: './customer-products.css'
})
export class CustomerProducts implements OnInit {
  products: any[] = [];
  isLoading = true;
  

  constructor(
    private productService: ProductService,
     private cartService: CartService, 
     private cdRef: ChangeDetectorRef,
     private messageService: MessageService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data: any[]) => {
        this.products = data;
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });
  }
  
  addToCart(product: any): void {
  this.cartService.addToCart(product.productId, 1).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `${product.productName} added to cart successfully!`
      });
    },
    error: (error: any) => {
      console.error('Error adding product to cart:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unable to add product to cart.'
      });
    }
  });
}

}
