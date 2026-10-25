import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product';
import { CategoryService } from '../services/category';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import {Router} from '@angular/router';
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

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  openLowStockProducts(): void {
  sessionStorage.setItem('showLowStockOnly', 'true');
  this.router.navigate(['/products']);
}
  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
  console.log('Dashboard products:', data);
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
  console.log('Dashboard categories:', data);
  this.totalCategories = data.length;
  this.cdRef.detectChanges();
},
      error: (error) => console.error('Category loading failed:', error)
    });
  }
}