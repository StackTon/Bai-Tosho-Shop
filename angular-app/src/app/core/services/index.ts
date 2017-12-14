import { HttpClientService } from './http-client.service';
import { AllUsersService } from './all-users/all-users.service';
import { AuthService } from './auth/auth.service';
import { CartService } from './cart/cart.service';
import { DetailsService } from './details/details.service';
import { GetProductsService } from './get-products/get-products.service';
import { ProductsService } from './products/products.service';

export const allServices = [
  HttpClientService,
  AllUsersService,
  AuthService,
  CartService,
  DetailsService,
  GetProductsService,
  ProductsService
]