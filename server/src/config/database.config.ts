import { connect } from "bun"
import mongoose from "mongoose"

const user_name = Bun.env.MONGODB_USER || 'Your_Username'
const user_password = Bun.env.MONGODB_PASSWORD || 'Your_Password'
const DB_name = Bun.env.MONGODB_NAME || 'Tinnner_App'

const uri = `mongodb+srv://${user_name}:${user_password}@cluster0.m9nlx.mongodb.net/?retryWrites=true&w=majority&appName=${DB_name}`

export const MongoDB = {
    connect: async function () {
        try {
            await mongoose.connect(uri)
            console.log('---MongoDB Connect---')
        } catch (error) {
            console.error('---MongoDB Connection Error---')
            console.error
        }
    }
}