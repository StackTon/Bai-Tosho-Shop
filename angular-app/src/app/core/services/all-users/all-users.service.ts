import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const baseUrl = 'http://localhost:5000/';

@Injectable()
export class AllUsersService {

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get(`${baseUrl}product/users`,
      {
        headers: this.createAuthHeaders()
      }
    );
  }
  makeAdmin(userId) {
    return this.http.post(baseUrl + "product/users/make-admin/" + userId,
      JSON.stringify({name:"kit"}),
      {
        headers: this.createAuthHeaders()
      }
    );
  }

  takeAdmin(userId) {
    return this.http.post(baseUrl + "product/users/take-admin/" + userId,
      JSON.stringify({name:"kit"}),
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
