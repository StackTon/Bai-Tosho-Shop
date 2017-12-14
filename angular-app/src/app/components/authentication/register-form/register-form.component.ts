import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';

@Component({
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
})
export class RegisterFormComponent implements OnInit {
  public registerForm: FormGroup;
  public usernameMessage: string;
  public passwordMessage: string;
  public confirmPasswordMessage: string;
  public firstNameMessage: string;
  public lastNameMessage: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  register() {
    this.authService.register(this.registerForm.value).subscribe(data => {
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
    localStorage.setItem('isAdmin', data["isAdmin"]);
    this.authService.authtoken = data['token'];
    this.authService.setAdmin = data['isAdmin'];
    this.route.navigate(['/home']);
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      firstName: ["", [Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ["", [Validators.minLength(3), Validators.maxLength(15)]],
      password: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(25)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(25)]]
    })

    const usernameControler = this.registerForm.get('username')
    usernameControler.valueChanges.subscribe(data => {
      this.setMessageUsername(usernameControler);
    })

    const passwordControler = this.registerForm.get('password')
    passwordControler.valueChanges.subscribe(data => {
      this.setMessagePassword(passwordControler);
    })

    const repeatPasswordControler = this.registerForm.get('confirmPassword')
    repeatPasswordControler.valueChanges.subscribe(data => {
      this.setMessageRepeatPassword(repeatPasswordControler);
    })


    const firstNameContorl = this.registerForm.get('firstName')
    firstNameContorl.valueChanges.subscribe(data => {
      this.setMessageFirstName(firstNameContorl);
    })

    const lastNameContorl = this.registerForm.get('lastName')
    lastNameContorl.valueChanges.subscribe(data => {
      this.setMessageLastName(lastNameContorl);
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

  setMessageRepeatPassword(c: AbstractControl): void {
    this.confirmPasswordMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      if (c.errors.required) {
        this.confirmPasswordMessage = "Confirm Password is required!"
      }
      if (c.errors.minlength) {
        this.confirmPasswordMessage = "Confirm Password must be more the 6 symbols!"
      }
      if (c.errors.maxlength) {
        this.confirmPasswordMessage = "Confirm Password max length is 25 symbols!"
      }
    }
  }

  setMessageFirstName(c: AbstractControl): void {
    this.firstNameMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      if (c.errors.minlength) {
        this.firstNameMessage = "First Name must be more the 3 symbols!"
      }
      if (c.errors.maxlength) {
        this.firstNameMessage = "First Name max length is 25 symbols!"
      }
    }
  }

  setMessageLastName(c: AbstractControl): void {
    this.lastNameMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      if (c.errors.minlength) {
        this.lastNameMessage = "Last Name must be more the 3 symbols!"
      }
      if (c.errors.maxlength) {
        this.lastNameMessage = "Last Name max length is 15 symbols!"
      }
    }
  }
}