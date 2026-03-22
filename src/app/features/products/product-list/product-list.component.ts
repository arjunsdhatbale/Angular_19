import { Component } from '@angular/core';

import { OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductService } from '../services/product.service';
import { ProductStore } from '../../../store/product.store';
import { Product } from '../models/product.model';
import { Select } from "primeng/select";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    Select,
    ToastModule,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule,
    Select
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
 

  private productService      = inject(ProductService);
  private productStore        = inject(ProductStore);
  private router              = inject(Router);
  private messageService      = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  products   = this.productStore.products;
  loading    = this.productStore.loading;
  categories = this.productStore.categories;

  selectedCategory = '';
  searchKeyword    = '';

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

loadProducts(): void {
    this.productStore.setLoading(true);
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.productStore.setProducts(res.data);
        this.productStore.setLoading(false);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load products'
        });
        this.productStore.setLoading(false);
      }
    });
  }

  loadCategories(): void {
    this.productService.getAllCategories().subscribe({
      next: (res) => this.productStore.setCategories(res.data),
      error: () => {}
    });
  }

  onCategoryChange(): void {
    if (this.selectedCategory) {
      this.productStore.setLoading(true);
      this.productService.getProductsByCategory(this.selectedCategory).subscribe({
        next: (res) => {
          this.productStore.setProducts(res.data);
          this.productStore.setLoading(false);
        },
        error: () => this.productStore.setLoading(false)
      });
    } else {
      this.loadProducts();
    }
  }
onSearch(): void {
    if (this.searchKeyword.trim()) {
      this.productService.searchProducts(this.searchKeyword).subscribe({
        next: (res) => this.productStore.setProducts(res.data),
        error: () => {}
      });
    } else {
      this.loadProducts();
    }
  }

  navigateToCreate(): void {
    this.router.navigate(['/products/create']);
  }

 navigateToEdit(product: Product): void {
    this.productStore.setSelectedProduct(product);
    this.router.navigate(['/products/edit', product.id]);
  }

  navigateToDetail(product: Product): void {
    this.router.navigate(['/products/detail', product.id]);
  }

  confirmDelete(product: Product): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${product.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteProduct(product.id)
    });


  }

deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.productStore.removeProduct(id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product deleted successfully'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete product'
        });
      }
    });
  }


  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
    const map: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
      ACTIVE:       'success',
      INACTIVE:     'warn',
      OUT_OF_STOCK: 'danger'
    };
    return map[status] || 'info';
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.searchKeyword    = '';
    this.loadProducts();
  }



}
