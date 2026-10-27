
import { Routes } from '@angular/router';
import { Categories } from './categories/categories';
import { Products } from './products/products';
import { Dashboard } from './dashboard/dashboard';
import {Cart} from './cart/cart';
import { CustomerProducts } from './customer-products/customer-products';
import { MyOrders } from './my-orders/my-orders';
import { AdminOrders } from './admin-orders/admin-orders';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'products', component: Products },
  { path: 'categories', component: Categories },
  { path: 'customer-products', component: CustomerProducts },
  { path: 'cart', component: Cart },
  { path: 'my-orders', component: MyOrders },
  { path: 'admin-orders', component: AdminOrders },
  { path: '**', redirectTo: 'dashboard' }
];
