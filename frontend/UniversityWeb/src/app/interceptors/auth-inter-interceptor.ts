import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountServic } from '../_services/account-servic';

export const authInterInterceptor: HttpInterceptorFn = (req, next) => {
  let accSer=inject(AccountServic);
  let token=accSer.readToken();
  if(token){
    req=req.clone({
      setHeaders:{
        Authorization:`Bearer ${token}`
      }
    })
  }
  return next(req);
};
