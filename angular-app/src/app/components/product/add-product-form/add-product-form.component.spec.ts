import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductFomrComponent } from './add-product-form.component';

describe('AddProductComponent', () => {
  let component: AddProductFomrComponent;
  let fixture: ComponentFixture<AddProductFomrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductFomrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductFomrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
