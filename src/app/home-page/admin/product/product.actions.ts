import { createAction, props } from '@ngrx/store';
import { Product } from './product.model';

export const loadProducts = createAction(
  '[Product List] Load Products',
  props<{ products: Product[] }>()
);

export const addProduct = createAction(
  '[Add Product] Add Product',
  props<{ product: Product }>()
);
