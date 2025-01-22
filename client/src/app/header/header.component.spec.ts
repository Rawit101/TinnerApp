import { Component, computed, inject, signal } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import { AccountService } from '../_services/account.service'
import { User } from '../_models/user'
import { MatMenuModule } from '@angular/material/menu'
@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterLinkActive, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private accountService = inject(AccountService)
  private router = inject(Router)
  user = computed(() => this.accountService.data()?.user)

  logOut() {
    this.accountService.logout()
    this.router.navigate(['/'])
  }
}