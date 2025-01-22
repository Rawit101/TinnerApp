import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"

export const PasswordValidator = function (minLength: number, maxLength: number): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
        const password = control.value as string
        if (!password) return { required: true }
        else if (password.length < minLength) return { inValidMinLength: true }
        else if (password.length > maxLength) return { inValidMaxLength: true }
        else if (!/[A-Z]/.test(password)) return { inValidUppercase: true }
        else if (!/[a-z]/.test(password)) return { inValidLowercase: true }
        else if (!/[0-9]/.test(password)) return { inValidNumber: true }
        else if (!/[~`! @#$%^&*()-_+={}[]|"<>,?]/.test(password)) return { inValidSpecialCharacter: true }
        return null
    }
}


