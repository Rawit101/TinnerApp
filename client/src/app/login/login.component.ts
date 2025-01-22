import { Component, inject, signal } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { PasswordValidator } from '../_validators/password.validator'
import { PasswordMatchValidator } from '../_validators/password.match.validator'
import { CommonModule } from '@angular/common'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { provideNativeDateAdapter } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatRadioModule } from '@angular/material/radio'
import { MatCardModule } from '@angular/material/card'
import { AccountService } from '../_services/account.service'
import { Router } from '@angular/router'
@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatDatepickerModule, MatRadioModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [provideNativeDateAdapter()]
})

export class LoginComponent {
  mode: 'login' | 'register' = 'login'
  form: FormGroup

  private accountService = inject(AccountService)
  private router = inject(Router)
  errorFromServer = ''
  private readonly _currentYear = new Date().getFullYear()
  readonly minDate = new Date(this._currentYear - 70, 0, 1)
  readonly maxDate = new Date(this._currentYear - 18, 11, 31)
  readonly startDate = new Date(this._currentYear - 18, 0, 1)


  errorMessages = {
    username: signal(''),
    password: signal(''),
    display_name: signal(''),
    confirm_password: signal('')
  }


  constructor() {
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      password: new FormControl(null, [Validators.required, PasswordValidator(8, 16)]),
    })
  }

  toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login'
    this.updateForm()
  }
  updateForm() {
    if (this.mode === 'register') {
      this.form.addControl('confirm_password', new FormControl(null, [Validators.required]))
      this.form.addValidators(PasswordMatchValidator('password', 'confirm_password'))

      this.form.addControl('display_name', new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(8)]))
      this.form.addControl('date_of_birth', new FormControl(null, Validators.required))
      this.form.addControl('gender', new FormControl(null, Validators.required))
      this.form.addControl('looking_for', new FormControl(null, Validators.required))

    } else {
      this.form.removeControl('confirm_password')
      this.form.removeValidators(PasswordMatchValidator('password', 'confirm_password'))
      this.form.removeControl('display_name')
      this.form.removeControl('date_of_birth')
      this.form.removeControl('gender')
      this.form.removeControl('looking_for')
    }
  }

  async onSubmit() {
    if (this.mode === 'login') {
      this.errorFromServer = await this.accountService.login(this.form.value)
    } else {
      this.errorFromServer = await this.accountService.register(this.form.value)
    }
    if (this.errorFromServer === '')
      this.router.navigate(['/'])
  }

  updateErrorMessages(ctrlName: string) {
    const control = this.form.controls[ctrlName]
    if (!control) return
    switch (ctrlName) {
      case 'username':
        if (control.hasError('required'))
          this.errorMessages.username.set('required')
        else if (control.hasError('minlength'))
          this.errorMessages.username.set('Username must be at least 6 characters')
        else if (control.hasError('maxlength'))
          this.errorMessages.username.set('Username must be at most 16 characters')
        else
          this.errorMessages.username.set('')
        break

      case 'password':
        if (control.hasError('required'))
          this.errorMessages.password.set('required')
        else if (control.hasError('inValidMinLength'))
          this.errorMessages.password.set('Password must be at least 8 characters long')
        else if (control.hasError('inValidMaxLength'))
          this.errorMessages.password.set('Password must be 16 characters or fewer')
        else if (control.hasError('inValidLowercase'))
          this.errorMessages.password.set('Password must contain minimum of one lower-case letter')
        else if (control.hasError('inValidUppercase'))
          this.errorMessages.password.set('Password must contain minimum of one Upper-case letter')
        else if (control.hasError('inValidNumber'))
          this.errorMessages.password.set('Password must contain minimum of one numeric character')
        else if (control.hasError('inValidSpecialCharacter'))
          this.errorMessages.password.set('Password must contain minimum of one special character')
        else
          this.errorMessages.password.set('')
        break

      case 'confirm_password':
        if (control.hasError('required'))
          this.errorMessages.confirm_password.set('required')
        else if (control.hasError('misMatch'))
          this.errorMessages.confirm_password.set('Do not match password')
        else
          this.errorMessages.confirm_password.set('')
        break

      case 'display_name':
        if (control.hasError('required'))
          this.errorMessages.display_name.set('required')
        else if (control.hasError('minlength'))
          this.errorMessages.display_name.set('Username must be at least 3 characters')
        else if (control.hasError('maxlength'))
          this.errorMessages.display_name.set('Username must be at most 8 characters')
        else
          this.errorMessages.display_name.set('')
        break
    }
  }
}
