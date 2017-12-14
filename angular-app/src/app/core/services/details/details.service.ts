import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const baseUrl = 'http://localhost:5000/';

@Injectable()
export class DetailsService {

  constructor(private http: HttpClient) { }

  getDetailsData(id) {
    return this.http.get(`${baseUrl}product/details/${id}/comments`,
      {
        headers: this.createAuthHeaders()
      }
    );
  }

  createCommnet(id, comment) {
    return this.http.post(`${baseUrl}product/details/${id}/comments/create`,
      JSON.stringify({comment}),
      {
        headers: this.createAuthHeaders()
      }
    );
  }

  deleteCommnet(id, commentId) {
    return this.http.get(`${baseUrl}product/details/${id}/comments/delete/${commentId}`,
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
