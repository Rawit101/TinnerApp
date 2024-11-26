import Elysia from "elysia"
import { User } from "../models/user.model"
import { AuthMiddleWare } from "../middleware/auth.middleware"

export const UserController = new Elysia({
    prefix: "/api/user",
    tags: ['User']
})
    .use(AuthMiddleWare)
    .get('/all', () => {
        return {
            Text: "Hello Word"
        }
    }, {
        isSignIn: true
    })