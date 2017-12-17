import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [CartService]
})
export class CartComponent implements OnInit {
  public cartData: any;
  public totalPrice: Number = 0;

  constructor(
    private cartService: CartService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private router: Router,
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.loadProduct()
  }

  loadProduct() {
    this.totalPrice = 0;
    this.cartService.getCartProducts().subscribe(data => {
      this.cartData = data
      for(let product of data["data"]["cart"]){
        this.totalPrice += product.price;
      }
    })
  }

  details(id) {
    this.router.navigate(['/details/' + id])
  }

  removeProduct(id) {
    this.cartService.removeProductFormCart(id).subscribe(data => {
      if (data["success"]) {
        this.toastr.success(data["message"], 'Success!');
        this.loadProduct()
      }
      else {
        this.toastr.error(data["message"], 'Error!');
      }
    })
  }

}
