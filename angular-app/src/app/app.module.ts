// MODULES
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ToastModule } from 'ng2-toastr/ng2-toastr'
import { ServiceModule } from './core/services/services.module';
import { GuardsModule } from './core/guards/guards.module';
import { AuthModule } from './components/authentication/auth.module';
import { ProductModule } from './components/product/product.module';
import { SharedModule } from './components/shared/shared.module';
import { RouterModule } from "@angular/router";
import { CommonModule } from '@angular/common/';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


// COMPONENTS
import { AppComponent } from './app.component';
import { routes } from './app.routing';


import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { AllUsersComponent } from './components/all-users/all-users.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CartComponent,
    AllUsersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule.forRoot(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceModule,
    GuardsModule,
    AuthModule,
    ProductModule,
    SharedModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    ToastModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
