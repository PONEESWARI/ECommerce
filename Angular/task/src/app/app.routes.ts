import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { authGuard } from '../auth.guard';
import { logoutGuard } from '../logout.guard';
import { ProductListComponent } from '../components/product-list/product-list.component';
import { CartComponent } from '../components/cart/cart.component';
import { CheckOutComponent } from '../components/check-out/check-out.component';
import { OrderSummaryComponent } from '../components/order-summary/order-summary.component';
import { OrderComponent } from '../components/order/order.component';
import { CustomerComponent } from '../components/customer/customer.component';

export const routes: Routes = [
    { path: 'signup', component: SignupComponent,canActivate:[logoutGuard] },
    { path: 'login', component: LoginComponent ,canActivate:[logoutGuard]},
    { path: 'product', component:ProductListComponent,canActivate:[authGuard]},
    { path: 'cart', component: CartComponent,canActivate:[authGuard] },
    { path: 'checkout', component: CheckOutComponent ,canActivate:[authGuard]}, // Define your checkout component here
    { path: 'order-summary', component: OrderSummaryComponent,canActivate:[authGuard]},
    { path: 'orders', component: OrderComponent,canActivate:[authGuard]},
    { path: 'customers',component:CustomerComponent, canActivate:[authGuard]},
    // { path: 'users', component: UserListComponent },
    { path: '', redirectTo: '/signup', pathMatch: 'full' },
]