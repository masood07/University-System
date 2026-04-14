import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IUser } from '../models/IUser';
import { IUserLogin } from '../models/IUserLogin';
import {jwtDecode} from 'jwt-decode'
import { IPayload2 } from '../models/IUserDataToken';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountServic {
baseurl='https://localhost:7030/api/user/' ;
http=inject(HttpClient);
isLogged=signal(false);
username=signal('')
isAdmin=signal(false);
isTeacher=signal(false);
isStudent=signal(false);

constructor() {
  this.syncAuthState();
}

register(user:IUser){
  return this.http.post<IUser>(this.baseurl+"register",user);
}
login(user:IUserLogin){
 return this.http.post(this.baseurl+"login",user,{
  responseType:'text'
 }).pipe(
  tap((token) => this.addToken(token))
 );
}
addToken(token:string){
  localStorage.setItem("token",token);
  this.syncAuthState();
}
readToken():string|null{
  return localStorage.getItem("token");
}
removeToken(){
  localStorage.removeItem("token");
  this.isLogged.set(false);
  this.username.set('');

}
isTokenExpired(){
  const token=this.readToken();
  if(!token)
    return true;
  const d=jwtDecode(token);
  if(!d?.exp)
    return true;
  const ctime=Math.floor(Date.now()/1000);
  return d.exp<ctime
}

syncAuthState() {
  const token = this.readToken();
  if (!token || this.isTokenExpired()) {
    this.isLogged.set(false);
    this.username.set('');
    return;
  }

  const data = jwtDecode<IPayload2>(token);
  this.username.set(data.name ?? '');
  this.isLogged.set(true);
}


}
