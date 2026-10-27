
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product';
import { CategoryService } from '../services/category';
import { ChangeDetectorRef as CDR } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  totalProducts = 0;
  totalCategories = 0;
  lowStockProducts = 0;
  totalOrders = 0;
  totalSales = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdRef: CDR,
    private router: Router,
    private http: HttpClient
  ) {}

  openLowStockProducts(): void {
    sessionStorage.setItem('showLowStockOnly', 'true');
    this.router.navigate(['/products']);
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.totalProducts = data.length;
        this.lowStockProducts = data.filter(
          (product: any) => product.stock <= 10
        ).length;
        this.cdRef.detectChanges();
      },
      error: (error) => console.error('Product loading failed:', error)
    });

    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.totalCategories = data.length;
        this.cdRef.detectChanges();
      },
      error: (error) => console.error('Category loading failed:', error)
    });

    this.http.get<any[]>('https://localhost:7141/api/Orders').subscribe({
      next: (orders) => {
        this.totalOrders = orders.length;
        this.totalSales = orders
          .filter((order: any) => order.status !== 'Cancelled')
          .reduce(
            (total: number, order: any) => total + order.totalAmount,
            0
          );
        this.cdRef.detectChanges();
      },
      error: (error) => console.error('Orders loading failed:', error)
    });
  }
}
