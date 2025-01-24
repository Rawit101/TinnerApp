import { HttpInterceptorFn } from '@angular/common/http'
import { AccountService } from '../_services/account.service'
import { inject } from '@angular/core'

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService)
  if (accountService.data()?.token) {
    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + accountService.data()?.token
      }
    })
  }
  return next(req)

}
0