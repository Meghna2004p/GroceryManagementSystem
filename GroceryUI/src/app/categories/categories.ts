
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../services/category';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {
  categories: any[] = [];
  searchText = '';

get filteredCategories(): any[] {
  return this.categories.filter((category: any) =>
    category.categoryName
      .toLowerCase()
      .includes(this.searchText.toLowerCase().trim())
  );
}
  editingCategoryId: number | null = null;
  newCategory = {
  categoryName: ''
};

  constructor(private categoryService: CategoryService, private cdRef: ChangeDetectorRef, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

loadCategories(): void {
  this.categoryService.getCategories().subscribe({
  next: (data) => {
  console.log('Categories loaded:', data);
  this.categories = data;
  this.cdRef.detectChanges();
},
    error: (error) => {
      console.error('Error loading categories:', error);
    }
  });
}
addCategory(): void {
  const categoryName = this.newCategory.categoryName.trim();

  if (!categoryName) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please enter a category name.'
    });
    return;
  }

  const alreadyExists = this.categories.some(
    (category: any) =>
      category.categoryName.toLowerCase() === categoryName.toLowerCase() &&
      category.categoryId !== this.editingCategoryId
  );

  if (alreadyExists) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Category already exists!'
    });
    return;
  }

  const request = { categoryName };

  if (this.editingCategoryId !== null) {
    this.categoryService
      .updateCategory(this.editingCategoryId, request)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Category updated successfully!'
          });

          this.cancelEdit();
          this.loadCategories();
        },
        error: (error) => console.error('Error updating category:', error)
      });
  } else {
    this.categoryService.addCategory(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Category added successfully!'
        });

        this.newCategory = { categoryName: '' };
        this.loadCategories();
      },
      error: (error) => console.error('Error adding category:', error)
    });
  }
}
editCategory(category: any): void {
  this.editingCategoryId = category.categoryId;
  this.newCategory = {
    categoryName: category.categoryName
  };
}

cancelEdit(): void {
  this.editingCategoryId = null;
  this.newCategory = {
    categoryName: ''
  };
}
deleteCategory(id: number): void {
  this.categoryService.deleteCategory(id).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Category deleted successfully!'
      });

      this.loadCategories();
    },
    error: (error) => {
      console.error('Error deleting category:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Could not delete category. It may be assigned to products.'
      });
    }
  });
}
}