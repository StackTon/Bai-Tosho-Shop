import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginFormComponent } from './components/authentication/login-form/login-form.component';
import { RegisterFormComponent } from './components/authentication/register-form/register-form.component';
import { CartComponent } from './components/cart/cart.component';
import { DetailsComponent } from './components/product/details/details.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { AddProductFormComponent } from './components/product/add-product-form/add-product-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { EditProductFormComponent } from './components/product/edit-product-form/edit-product-form.component';
import { LogoutComponent } from './components/authentication/logout/logout.component';

import { AuthGuard } from './core/guards/authentication/auth.guard';
import { AdminGuard } from './core/guards/admin/admin.guard'; 


export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'cart', canActivate: [AuthGuard], component: CartComponent },
  { path: 'details/:productId', canActivate: [AuthGuard], component: DetailsComponent },
  { path: 'users', canActivate: [AdminGuard], component: AllUsersComponent },
  { path: 'addProduct', canActivate: [AdminGuard], component: AddProductFormComponent },
  { path: 'editProduct/:productId', canActivate: [AdminGuard], component: EditProductFormComponent },
  { path: 'logout', canActivate: [AuthGuard], component: LogoutComponent },
  { path: '', component: NotFoundComponent }
];