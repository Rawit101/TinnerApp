import { error } from "elysia"
import { User } from "../models/user.model"
import { login, register, user } from "../types/account.types"


export const AccountServices = {
    login: async function (loginData: login): Promise<user> {
        const user = await User.findOne({ username: loginData.username }).exec()
        if (!user)
            throw new Error("User Does not exits")
        const verifyPAssword = user?.verifyPAssword(loginData.password)
        if (!verifyPAssword)
            throw new Error("Password is incorrect")
        return user.ToUser()
    },

    createNewUser: async function (registerData: register): Promise<user> {
        const user = await User.findOne({ username: registerData.username }).exec()
        if (user)
            throw new Error(`${registerData.username} !!! Already Exists`)
        const newUser = await User.createUser(registerData)
        return newUser.ToUser()
    }
}