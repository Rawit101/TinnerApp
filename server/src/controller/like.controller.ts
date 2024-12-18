import Elysia from "elysia"
import { AuthMiddleWare } from "../middleware/auth.middleware"
import { AuthPayLoad } from "../middleware/auth.middleware"
import { UserDto } from "../types/user.type"
import { LikeService } from "../services/like.services"
export const LikeController = new Elysia({
    prefix: "api/like",
    tags: ['Like']
})
    .use(AuthMiddleWare)
    .use(UserDto)
    .put('/', async ({ body: { target_id }, set, Auth }) => {
        try {
            const user_id = (Auth.payload as AuthPayLoad).id
            await LikeService.toggleLike(user_id, target_id)
            set.status = "No Content"
        } catch (error) {
            set.status = "Bad Request"
            throw error
        }
    }, {
        detail: { summary: "Toggle Like" },
        isSignIn: true,
        body: "target_id"
    })