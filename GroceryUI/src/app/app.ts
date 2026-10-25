import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import{Products} from './products/products';
import { Toast } from 'primeng/toast';
import {RouterLink } from '@angular/router';
import{RouterLinkActive} from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Toast,RouterLink,RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('GroceryUI');
}
