import { Component, Inject, inject, Injectable, input } from '@angular/core'
import { User } from '../../_models/user'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'
import { CommonModule } from '@angular/common'
import { MatDialog } from '@angular/material/dialog'
import { UploadPhotoComponent } from '../../_dialogs/upload-photo/upload-photo.component'
import { AccountService } from '../../_services/account.service'
import { TimeagoClock, TimeagoCustomFormatter, TimeagoDefaultClock, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago'
import { strings as engString } from 'ngx-timeago/language-strings/en.js'

// @Injectable()
// class MyInTl extends TimeagoIntl { }

@Component({
  selector: 'app-photo',
  imports: [MatButtonModule, MatIconModule, MatCardModule, CommonModule, TimeagoModule],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.scss',
  providers: [
    { provide: TimeagoIntl, useClass: TimeagoIntl },
    { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
    { provide: TimeagoClock, useClass: TimeagoDefaultClock }
  ]
})
export class PhotoComponent {
  // intl = inject(TimeagoIntl)
  user = input.required<User>()

  constructor(intl: TimeagoIntl) {
    intl.strings = engString
    intl.changes.next()
  }

  private dialog = inject(MatDialog)
  private accountService = inject(AccountService)

  openAddPhotoDialog() {
    const ref = this.dialog.open(UploadPhotoComponent)
    ref.afterClosed().subscribe(async file => {
      await this.accountService.UploadPhoto(file)
    })
  }

  deletePhoto(photo_id: string) {
    this.accountService.deletePhoto(photo_id)
  }
  setAvatar(photo_id: string) {
    this.accountService.setAvatar(photo_id)
  }
}
