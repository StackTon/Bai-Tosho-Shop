import { Injectable } from "@angular/core";
import { LoginModel } from "../../models/login.model";
import { RegisterModel } from "../../models/register.model";
import { HttpClientService } from "../http-client.service";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';

const registerUrl = `http://localhost:5000/auth/register`;
const loginUrl = `http://localhost:5000/auth/login`;


@Injectable()
export class AuthService {
  public redirectUrl : string;
  private currentAuthtoken : string;
  private admin: Boolean;

  constructor(
    private httpService : HttpClientService,
    private router : Router,
    private http : HttpClient
  ) { }


  login(loginModel : LoginModel) {
    return this.http.post(
      loginUrl,
      JSON.stringify(loginModel),
      {
        headers: this.createAuthHeaders()
      }
    )
  }

  register(registerModel: RegisterModel) : Observable<Object> {
    return this.http.post(
      registerUrl, 
      JSON.stringify(registerModel),
      { 
        headers: this.createAuthHeaders()
      }
    )
  }

  isAdmin(){
    if(this.isLoggedIn() && this.admin){
      return true;
    }
    return false;
  }

  isLoggedIn() {
    let authtoken : string = localStorage.getItem('authtoken');
    return authtoken === this.currentAuthtoken;
  }

  get authtoken() {
    return this.currentAuthtoken;
  }

  set authtoken(value : string) {
    this.currentAuthtoken = value;
  }

  get getAdmin() {
    return this.admin;
  }

  set setAdmin(value : boolean) {
    this.admin = value;
  }


  tryNavigate() {
    if (this.redirectUrl) {
      this.router.navigate([this.redirectUrl]);
    } else {
      this.router.navigate([""]);
    }
  }

  private createAuthHeaders() : HttpHeaders {
      return new HttpHeaders({
        'Authorization': `bearer ${this.authtoken}`,
        'Content-Type': 'application/json'
      })
  }
}