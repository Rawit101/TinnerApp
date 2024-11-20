import mongoose from "mongoose"
import { register, user } from "../types/account.types"

type userWithOutID = Omit<user, 'id'>

export interface IUserDocument extends mongoose.Document, userWithOutID {
    password_hash: string
    verifyPAssword: (password: string) => Promise<boolean>
    ToUser: () => user
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
    createUser: (registerData: register) => Promise<IUserDocument>
}

