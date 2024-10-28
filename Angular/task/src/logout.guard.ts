import { CanActivateFn } from '@angular/router';

export const logoutGuard: CanActivateFn = (route, state) => {
  if(localStorage.getItem('token')){
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('cart');
  }
  return true;
};
