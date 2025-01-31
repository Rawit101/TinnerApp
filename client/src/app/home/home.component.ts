
import { Component, computed, inject, Signal } from '@angular/core'
import { AccountService } from '../_services/account.service'
import { MemberComponent } from '../member/member.component'
import { User } from '../_models/user'


@Component({
  selector: 'app-home',
  imports: [MemberComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private accountService = inject(AccountService)
  user: Signal<User | undefined>

  constructor() {
    this.user = computed(() => this.accountService.data()?.user)
  }
}
