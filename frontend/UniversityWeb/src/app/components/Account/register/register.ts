import { Component, inject } from '@angular/core';
import { IUser } from '../../../models/IUser';
import { FormsModule } from '@angular/forms';
import { AccountServic } from '../../../_services/account-servic';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  user:IUser={};
  errorMessage='';
  accSer=inject(AccountServic);
  router=inject(Router);
  save(){
      this.errorMessage='';
      this.accSer.register(this.user).subscribe({
        next:()=> this.router.navigateByUrl('/login'),
        error:()=> this.errorMessage='Registration failed. Please check the data and try again.'
      });
  }

}
