import { Component } from '@angular/core';
import { OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../services/product.service';
import { ProductStore } from '../../../../store/product.store';
 


@Component({
  selector: 'app-product-form',
   standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    InputText,
    Textarea,
    InputNumber,
    Select,
    Button,
    Card,
    Toast],
  providers: [MessageService],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit{
  
  
  private fb             = inject(FormBuilder);
  private productService = inject(ProductService);
  private productStore   = inject(ProductStore);
  private router         = inject(Router);
  private route          = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  productForm!: FormGroup;
  isEditMode = false;
  productId!: number;
  loading = false;

  statusOptions = [
    { label: 'Active',       value: 'ACTIVE'       },
    { label: 'Inactive',     value: 'INACTIVE'     },
    { label: 'Out of Stock', value: 'OUT_OF_STOCK' }
  ];

  categoryOptions = [
    { label: 'Electronics',  value: 'Electronics'  },
    { label: 'Clothing',     value: 'Clothing'     },
    { label: 'Food',         value: 'Food'         },
    { label: 'Books',        value: 'Books'        },
    { label: 'Furniture',    value: 'Furniture'    },
    { label: 'Other',        value: 'Other'        }
  ];

  ngOnInit(): void {
    this.productId  = this.route.snapshot.params['id'];
    this.isEditMode = !!this.productId;
    this.initForm();
    if (this.isEditMode) {
      this.loadProductData();
    }
  }
initForm(): void {
    this.productForm = this.fb.group({
      name:        ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.maxLength(1000)]],
      price:       [null, [Validators.required, Validators.min(0.01)]],
      stock:       [0,    [Validators.required, Validators.min(0)]],
      category:    ['', Validators.required],
      imageUrl:    [''],
      status:      ['ACTIVE', Validators.required]
    });
  }

  loadProductData(): void {
    const selected = this.productStore.selectedProduct();
    if (selected) {
      this.productForm.patchValue(selected);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;
    this.loading = true;

    const request$ = this.isEditMode
      ? this.productService.updateProduct(this.productId, this.productForm.value)
      : this.productService.createProduct(this.productForm.value);

    request$.subscribe({
      next: (res) => {
        this.isEditMode
          ? this.productStore.updateProduct(res.data)
          : this.productStore.addProduct(res.data);
        this.messageService.add({
          severity: 'success',
          summary:  'Success',
          detail:   `Product ${this.isEditMode ? 'updated' : 'created'} successfully`
        });
        setTimeout(() => this.router.navigate(['/products']), 1500);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary:  'Error',
          detail:   'Operation failed. Please try again.'
        });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
