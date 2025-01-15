import { AbstractControl, ValidationErrors, Validator, ValidatorFn } from "@angular/forms"

export const PasswordValidator = function (minLength: number, maxLength: number): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
        const password = control.value as string
        if (!password)
            return { required: true }
        else if (password.length < minLength)
            return { invalidMinlength: true }
        else if (password.length < maxLength)
            return { invalidMaxlength: true }
        else if (!/[a-z]/.test(password))
            return { invalidLowerCase: true }
        else if (!/[A-Z]/.test(password))
            return { invalidUpperCase: true }
        else if (!/[0-9]/.test(password))
            return { invalidNumberic: true }
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
            return { invalidSpecialCharacter: true }
        else
            return null
    }
}


