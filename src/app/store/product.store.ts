// store/product.store.ts
import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../features/products/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductStore {

  private _products      = signal<Product[]>([]);
  private _loading       = signal<boolean>(false);
  private _error         = signal<string | null>(null);
  private _selectedProduct = signal<Product | null>(null);
  private _categories    = signal<string[]>([]);

  // Selectors
  products        = computed(() => this._products());
  loading         = computed(() => this._loading());
  error           = computed(() => this._error());
  selectedProduct = computed(() => this._selectedProduct());
  categories      = computed(() => this._categories());
  totalProducts   = computed(() => this._products().length);
  activeProducts  = computed(() => this._products().filter(p => p.status === 'ACTIVE'));
  outOfStock      = computed(() => this._products().filter(p => p.stock === 0));

  // Actions
  setProducts(products: Product[])          { this._products.set(products); }
  setLoading(val: boolean)                  { this._loading.set(val); }
  setError(msg: string | null)              { this._error.set(msg); }
  setSelectedProduct(product: Product | null) { this._selectedProduct.set(product); }
  setCategories(categories: string[])       { this._categories.set(categories); }

  addProduct(product: Product) {
    this._products.update(products => [...products, product]);
  }

  updateProduct(updated: Product) {
    this._products.update(products =>
      products.map(p => p.id === updated.id ? updated : p)
    );
  }

  removeProduct(id: number) {
    this._products.update(products => products.filter(p => p.id !== id));
  }
}