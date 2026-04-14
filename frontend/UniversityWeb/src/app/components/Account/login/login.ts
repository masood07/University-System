import { Component, inject } from '@angular/core';
import { IUserLogin } from '../../../models/IUserLogin';
import { FormsModule } from '@angular/forms';
import { AccountServic } from '../../../_services/account-servic';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  user:IUserLogin={};
  errorMessage='';
  accSer=inject(AccountServic);
  router=inject(Router)
  login(){
      this.errorMessage='';
      this.accSer.login(this.user).subscribe({
        next:()=> this.router.navigateByUrl('/dashboard'),
        error:()=> this.errorMessage='Invalid username or password. Please try again.'
      });
  }

}
