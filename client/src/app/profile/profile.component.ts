import { Component, inject, ViewChild } from '@angular/core'
import { User } from '../_models/user'
import { AccountService } from '../_services/account.service'
import { MatTabsModule } from '@angular/material/tabs'
import { CommonModule } from '@angular/common'
import { FormsModule, NgForm } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button'
import { PhotoComponent } from "./photo/photo.component"

@Component({
  selector: 'app-profile',
  imports: [MatTabsModule, CommonModule, FormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatButtonModule, PhotoComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  accoutService = inject(AccountService)
  user: User
  @ViewChild('form') form?: NgForm
  constructor() {
    this.user = this.accoutService.data()!.user
  }

  onSubmit() {
    this.accoutService.updateProfile(this.form!.value)
  }
}
