import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient,HttpHeaders } from '@angular/common/http';

const baseUrl = 'http://localhost:5000/';

@Injectable()
export class GetProductsService {

  constructor(private http: HttpClient) { }

  getProducts(){
    return this.http.get(`${baseUrl}product/all`, {
      headers: this.createAuthHeaders()
    })
  }

  private createAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": "bearer " + localStorage.getItem("authtoken")
    })
  }
}
