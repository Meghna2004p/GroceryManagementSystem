import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerProducts } from './customer-products';

describe('CustomerProducts', () => {
  let component: CustomerProducts;
  let fixture: ComponentFixture<CustomerProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerProducts],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
