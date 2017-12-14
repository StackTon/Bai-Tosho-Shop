import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  public loginForm: FormGroup;
  public usernameMessage: string;
  public passwordMessage: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe(data => {
      if (data["success"]) {
        this.toastr.success(data["message"], 'Success!');
        this.successfulLogin(data);
      }
      else {
        this.toastr.error(data["message"], 'Error!');
      }
    })
  } 

  successfulLogin(data): void {
    localStorage.setItem('authtoken', data['token']);
    localStorage.setItem('username', data['username']);
    this.authService.authtoken = data['token'];
    this.authService.setAdmin = data['isAdmin'];
    this.route.navigate(['/home']);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      password: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(25)]],
    })

    const usernameControler = this.loginForm.get('username')
    usernameControler.valueChanges.subscribe(data => {
      this.setMessageUsername(usernameControler);
    })

    const passwordControler = this.loginForm.get('password')
    passwordControler.valueChanges.subscribe(data => {
      this.setMessagePassword(passwordControler);
    })

  }

  setMessageUsername(c: AbstractControl): void {
    this.usernameMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      if (c.errors.required) {
        this.usernameMessage = "Username is required!"
      }
      if (c.errors.minlength) {
        this.usernameMessage = "Username must be more the 5 symbols!"
      }
      if (c.errors.maxlength) {
        this.usernameMessage = "Username max length is 20 symbols!"
      }

    }
  }

  setMessagePassword(c: AbstractControl): void {
    this.passwordMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      if (c.errors.required) {
        this.passwordMessage = "Password is required!"
      }
      if (c.errors.minlength) {
        this.passwordMessage = "Password must be more the 6 symbols!"
      }
      if (c.errors.maxlength) {
        this.passwordMessage = "Password max length is 25 symbols!"
      }
    }
  }
}