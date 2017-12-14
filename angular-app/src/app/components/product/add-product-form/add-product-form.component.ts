import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ProductsService } from '../../../core/services/products/products.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product-form.component.html',
  styleUrls: ['./add-product-form.component.css'],
  providers: [ProductsService]
})
export class AddProductFormComponent implements OnInit {
  public createProductForm: FormGroup;
  public nameMessage: string;
  public imageUrlMessage: string;
  public desctiptionMessage: string;
  public priceMessage: string;

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private route: Router
  ) { }

  createProduct() {
    this.productService.createProduct(this.createProductForm.value).subscribe(data => {
      if (data["success"]) {
        this.route.navigate(['/home']);
      }
      else{
        //TODO HANDLE ERROR
      }
    })
  }

  ngOnInit(): void {
    this.createProductForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      imageUrl: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      description: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      price: ["", [Validators.required]],
    })

    const nameControler = this.createProductForm.get('name')
    nameControler.valueChanges.subscribe(data => {
      this.setMessageName(nameControler);
    })

    const imageUrlControler = this.createProductForm.get('imageUrl')
    imageUrlControler.valueChanges.subscribe(data => {
      this.setMessageImageUrl(imageUrlControler);
    })

    const desctiptionControler = this.createProductForm.get('description')
    desctiptionControler.valueChanges.subscribe(data => {
      this.setMessageDesctiption(desctiptionControler);
    })

    const priceControler = this.createProductForm.get('price')
    priceControler.valueChanges.subscribe(data => {
      this.setMessagePrice(priceControler);
    })

  }

  setMessageName(c: AbstractControl): void {
    this.nameMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      if (c.errors.required) {
        this.nameMessage = "Name is required!"
      }
      if (c.errors.minlength) {
        this.nameMessage = "Name must be more the 3 symbols!"
      }
      if (c.errors.maxlength) {
        this.nameMessage = "Name max length is 20 symbols!"
      }

    }
  }

  setMessageImageUrl(c: AbstractControl): void {
    this.imageUrlMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      if (c.errors.required) {
        this.imageUrlMessage = "Image URL is required!"
      }
      if (c.errors.minlength) {
        this.imageUrlMessage = "Image URL must be more the 6 symbols!"
      }
      if (c.errors.maxlength) {
        this.imageUrlMessage = "Image URL max length is 100 symbols!"
      }
    }
  }

  setMessageDesctiption(c: AbstractControl): void {
    this.desctiptionMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      if (c.errors.required) {
        this.desctiptionMessage = "Description is required!"
      }
      if (c.errors.minlength) {
        this.desctiptionMessage = "Description must be more the 10 symbols!"
      }
      if (c.errors.maxlength) {
        this.desctiptionMessage = "Description max length is 100 symbols!"
      }
    }
  }

  setMessagePrice(c: AbstractControl): void {
    this.priceMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      if (c.errors.required) {
        this.priceMessage = "Price is required!"
      }
    }
  }
}

