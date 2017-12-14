import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DetailsService } from '../../../core/services/details/details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../core/services/products/products.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { CommentModel } from '../../../core/models/comment.model';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [DetailsService, ProductsService, CartService]
})
export class DetailsComponent implements OnInit {
  public productId: String;
  public detailsData: Object;
  public likes: any = 0;
  public userLike: Boolean = false;
  public commentModel: CommentModel;

  constructor(
    private detailsService: DetailsService,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsService,
    private cart: CartService,
    private auth: AuthService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.productId = this.route.snapshot.params['productId'];
    this.commentModel = new CommentModel("");
  }

  commentSubmit() {
    this.detailsService.createCommnet(this.productId, this.commentModel.comment).subscribe(data => {
      if (data["success"]) {
        this.detailsData["comments"].push(data["comment"])
        this.commentModel.comment = "";
      }
      else {
        // TODO handle error
      }
    })
  }

  edit(id) {
    this.router.navigate(['/editProduct/' + id])
  }

  buy(id) {
    this.cart.buyProduct(id).subscribe(data => {
      //todo notification
    })
  }

  delete(id) {
    this.productService.deleteProduct(id).subscribe(data => {
      let index = 0;
      if (data["success"]) {
        this.toastr.success(data["message"], 'Success!');
        this.router.navigate(['/home']);
      }
      else {
        this.toastr.error(data["message"], 'Error!');
      }
    })
  } 

  ngOnInit() {
    this.detailsService.getDetailsData(this.productId).subscribe(data => {
      this.detailsData = data;
      this.likes = data["likes"].length;
      let u = localStorage.getItem("username")
      for (let username of data["likes"]) {
        if (username === u) {
          this.userLike = true;
          break;
        }
      }
    })
  }

  like(id) {
    this.cart.like(id).subscribe(data => {
      if (data["success"]) {
        this.toastr.success(data["message"], 'Success!');        
        this.likes++;
        this.userLike = true;
      }
      else {
        this.toastr.error(data["message"], 'Error!');
      }
    })
  }

  dislike(id) {
    this.cart.dislike(id).subscribe(data => {
      if (data["success"]) {
        this.toastr.success(data["message"], 'Success!');        
        this.likes--;
        this.userLike = false;
      }
      else {
        this.toastr.error(data["message"], 'Error!');
      }
    })
  }

  dateFormating(date) {
    return date;
  }

  deleteComment(id) {
    this.detailsService.deleteCommnet(this.productId, id).subscribe(data => {
      if (data["success"]) {
        this.toastr.success(data["message"], 'Success!');        
        let index = 0;
        for (let i = 0; i < this.detailsData["comments"].length; i++) {
          let comment = this.detailsData["comments"][i];
          if (comment._id === id) {
            index = i;
            break;
          }
        }
        this.detailsData["comments"].splice(index, 1);
      }
      else {
        this.toastr.error(data["message"], 'Error!');
      }
    })
  }

  canDeleteCommnet(creatorId) {
    const username = localStorage.getItem('username');
    if (creatorId === username) {
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


