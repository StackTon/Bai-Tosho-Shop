import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const baseUrl = 'http://localhost:5000/';


@Injectable()
export class CartService {

  constructor(private http: HttpClient) { }

  getCartProducts() {
    return this.http.get(`${baseUrl}product/myproducts`,
      {
        headers: this.createAuthHeaders()
      }
    );
  }

  buyProduct(productId) {
    return this.http.post(`${baseUrl}product/user/buy/` + productId,
    JSON.stringify({name: "kit"}),
      {
        headers: this.createAuthHeaders()
      }
    );
  }

  removeProductFormCart(productId) {
    return this.http.post(`${baseUrl}product/user/remove/` + productId, 
    JSON.stringify({name: "kit"}),
      {
        headers: this.createAuthHeaders()
      }
    );
  }

  like(productId){
    return this.http.post(`${baseUrl}product/details/${productId}/like`, 
    JSON.stringify({name: "kit"}),
      {
        headers: this.createAuthHeaders()
      }
    );
  }

  dislike(productId){
    return this.http.post(`${baseUrl}product/details/${productId}/dislike`, 
    JSON.stringify({name: "kit"}),
      {
        headers: this.createAuthHeaders()
      }
    );
  }

  private createAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": "bearer " + localStorage.getItem("authtoken")
    })
  }
}
