
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product';
import { ChangeDetectorRef } from '@angular/core';
import{MessageService} from 'primeng/api';
import{CategoryService} from '../services/category';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  editingProductId: number | null = null;

  products: any[] = [];
  categories: any[] = [];
  isLoading = true;
  sortOption = 'name';
  lowStockLimit = 10;
  searchText: string = '';
  showLowStockOnly = false;
  get filteredProducts(): any[] {
 let result = this.products.filter((product: any) =>
  product.productName.toLowerCase().includes(this.searchText.toLowerCase().trim()) &&
  (!this.showLowStockOnly || product.stock <= 10)
);

  if (this.sortOption === 'name') {
    result.sort((a, b) =>
      a.productName.localeCompare(b.productName)
    );
  } else if (this.sortOption === 'priceLow') {
    result.sort((a, b) => a.price - b.price);
  } else if (this.sortOption === 'priceHigh') {
    result.sort((a, b) => b.price - a.price);
  }

  return result;
}

  newProduct = {
    productName: '',
    price: 0,
    stock: 0,
    categoryId: 0
  };

  constructor(private productService: ProductService, private cdRef: ChangeDetectorRef, private messageService: MessageService, private categoryService: CategoryService) {}

ngOnInit(): void {
  this.loadProducts();

  this.categoryService.getCategories().subscribe({
    next: (data) => {
      this.categories = data;
      this.cdRef.detectChanges();
    },
    error: (error) => console.error('Error loading categories:', error)
  });

  this.showLowStockOnly =
    sessionStorage.getItem('showLowStockOnly') === 'true';

  sessionStorage.removeItem('showLowStockOnly');
}

loadProducts(): void {
  this.isLoading = true;

  this.productService.getProducts().subscribe({
    next: (data) => {
      this.products = [...data];
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



addProduct(): void {
  
if (
  !this.newProduct.productName.trim() ||
  this.newProduct.price <= 0 ||
  this.newProduct.stock < 0 ||
  !Number.isInteger(Number(this.newProduct.stock))
) {
  this.messageService.add({
    severity: 'warn',
    summary: 'Invalid Input',
    detail: 'Enter a product name, a price above 0, and a whole number for stock.'
  });
  return;
}

  if (this.editingProductId !== null) {
    // Update existing product
    this.productService
      .updateProduct(this.editingProductId, this.newProduct)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product updated successfully!'
          });
          this.resetForm();
          this.loadProducts();
        },
        error: (error: any) => {
          console.error('Update error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Product update failed!'
          });
        }
      });
  } else {
    // Add new product
    this.productService.addProduct(this.newProduct).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product added successfully!'
        });
        this.resetForm();
        this.loadProducts();
      },
      error: (error: any) => {
        console.error('Add error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Product add failed!'
        });
      }
    });
  }
}

editProduct(product: any): void {
  this.editingProductId = product.productId;

  this.newProduct = {
    productName: product.productName,
    price: product.price,
    stock: product.stock,
    categoryId: product.categoryId ?? 0
  
  };
}


deleteProduct(id: number): void {
  this.productService.deleteProduct(id).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product deleted successfully!'
      });

      this.loadProducts();
    },
    error: (error: any) => {
      console.error('Delete error:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete product.'
      });
    }
  });
}


resetForm(): void {
  this.editingProductId = null;

  this.newProduct = {
    productName: '',
    price: 0,
    stock: 0,
    categoryId: 0
  };
}
}