import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { GetProductsService } from '../../core/services/get-products/get-products.service';
import { Router } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { CartService } from '../../core/services/cart/cart.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [GetProductsService, ProductsService, CartService]
})
export class HomeComponent implements OnInit {
  public products: any = [];

  constructor(
    private getProducts: GetProductsService,
    private router: Router,
    private productService: ProductsService,
    private cart: CartService,
    private auth: AuthService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.getProducts.getProducts().subscribe(data => {
      this.products = data;
    })
  }

  edit(id) {
    this.router.navigate(['/editProduct/' + id])
  }

  details(id) {
    this.router.navigate(['/details/' + id])
  }

  buy(id) {
    this.cart.buyProduct(id).subscribe(data => {
      if (data["success"]) {
        this.toastr.success(data["message"], 'Success!');
      }
      else {
        this.toastr.error(data["message"], 'Error!');
      }
    })
  }

  delete(id) {
    this.productService.deleteProduct(id).subscribe(data => {
      let index = 0;
      if (data["success"]) {
        for (let i = 0; i < this.products.length; i++) {
          if (this.products[i]._id === id) {
            index = i;
            break;
          }
        }
        this.toastr.success(data["message"], 'Success!');
        this.products.splice(index, 1);
      }
      else {
        this.toastr.error(data["message"], 'Error!');
      } 
    })
  }

  isAuth() {
    if (this.auth.isLoggedIn()) {
      return true;
    }
    return false;
  }

  isAdmin() {
    if (this.auth.isAdmin()) {
      return true;
    }
    return false;
  }

}
