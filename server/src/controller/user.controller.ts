import Elysia from "elysia"
import { AuthMiddleWare, AuthPayLoad } from "../middleware/auth.middleware"
import { UserService } from "../services/user.services"
import { _pagination } from "../types/pagination.type"
import { UserDto } from "../types/user.type"
import { set } from "mongoose"

export const UserController = new Elysia({
    prefix: "/api/user",
    tags: ['User']
})
    .use(UserDto)
    .use(AuthMiddleWare)
    .get('/all', () => {
        return {
            user: [
                { id: '1221', name: 'a' },
                { id: '1221', name: 'a' }
            ]
        }
    })

    .get('/', ({ query, Auth }) => {
        const user_id = (Auth.payload as AuthPayLoad).id
        return UserService.get(query, user_id)
    },
        {
            detail: { summary: "Get user" },
            query: "pagination",
            Response: "users",
            isSignin: true,
        })


    .patch('/', async ({ body, set, Auth }) => {
        try {
            const user_id = (Auth.payload as AuthPayLoad).id
            await UserService.updateProfile(body, user_id)
            set.status = "No Content"
        } catch (error) {
            set.status = 'Bad Request'
            if (error instanceof Error)
                throw new Error(error.message)
            set.status = "Internal Server Error"
            throw new Error("Some Thing went wrong , try again later")
        }
    }
        , {
            detail: { summary: "Update Profile" },
            body: "updateProfile",
            // response: "user",
            isSignIn: true
        })