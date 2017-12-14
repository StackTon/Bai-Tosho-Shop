import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const createProductUrl = "http://localhost:5000/product/create"
const editProductUrl = "http://localhost:5000/product/edit/"
const deleteProductUrl = "http://localhost:5000/product/delete/"

@Injectable()
export class ProductsService {

  constructor(private http: HttpClient) { }

  createProduct(product) {
    return this.http.post(
      createProductUrl,
      JSON.stringify(product),
      {
        headers: this.createAuthHeaders()
      }
    )
  }

  editProduct(product, productId) {
    return this.http.post(
      editProductUrl + productId,
      JSON.stringify(product),
      {
        headers: this.createAuthHeaders()
      }
    )
  }


  deleteProduct(productId) {
    return this.http.post(
      deleteProductUrl + productId,
      JSON.stringify({name:"kazan"}),
      {
        headers: this.createAuthHeaders()
      }
    )
  }


  private createAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "bearer " + localStorage.getItem('authtoken')
    })
  }
}
