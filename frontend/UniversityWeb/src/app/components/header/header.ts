import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AccountServic } from '../../_services/account-servic';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  accSer = inject(AccountServic);
  router = inject(Router);

  logout() {
    this.accSer.removeToken();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
