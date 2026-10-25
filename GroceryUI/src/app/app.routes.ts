
import { Routes } from '@angular/router';
import { Categories } from './categories/categories';
import { Products } from './products/products';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'products', component: Products },
  { path: 'categories', component: Categories },
  { path: '**', redirectTo: 'dashboard' }
];