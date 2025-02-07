import { createReducer, on } from '@ngrx/store';
import { loadProducts, addProduct } from './product.actions';
import { Product } from './product.model';


export const initialState: Product[] = [];

const _productReducer = createReducer(
  initialState,
  on(loadProducts, (state, { products }) => {
    console.log('Reducer: Loading products into state:', products);
    return [...products];
  }),
  on(addProduct, (state, { product }) => {
    console.log('Reducer: Adding product to state:', product);
    return [...state, product];
  })
);

export function productReducer(state: any, action: any) {
  return _productReducer(state, action);
}
