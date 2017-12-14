import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [CartService]
})
export class CartComponent implements OnInit {
  public cartData: any;

  constructor(
    private cartService: CartService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.loadProduct()
  }

  loadProduct() {
    this.cartService.getCartProducts().subscribe(data => {
      this.cartData = data
    })
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
