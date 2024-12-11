import Elysia, { error, t } from "elysia"
import { ImageHelper } from "../helper/image.helper"
import { PhotoDto } from "../types/photo.type"
import { AuthMiddleWare, AuthPayLoad } from "../middleware/auth.middleware"
import { PhotoService } from "../services/photo.services"

export const photoController = new Elysia({
    prefix: "api/photo",
    tags: ["photo"]
})
    .use(AuthMiddleWare)
    .use(PhotoDto)

    .post('/', async ({ body: { file }, set, Auth }) => {
        const user_id = (Auth.payload as AuthPayLoad).id
        try {
            return await PhotoService.upload(file, user_id)

        } catch (error) {
            set.status = "Bad Request"
            if (error instanceof Error)
                throw error
            throw new Error("Something went wrong, try again later !!")
        }
    }, {
        detail: { summary: "Upload Photo" },
        body: "upload",
        response: "photo",
        isSignIn: true
    })