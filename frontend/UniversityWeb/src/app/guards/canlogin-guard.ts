import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountServic } from '../_services/account-servic';

export const canloginGuard: CanActivateFn = (route, state) => {
  let accSer=inject(AccountServic);
  accSer.syncAuthState();
  
  if(accSer.isLogged())
    return true;
  let router=inject(Router);
  router.navigateByUrl("/login");

  return false;
};
