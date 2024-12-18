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


    .patch('/:photo_id', async ({ params: { photo_id }, set, Auth }) => {
        try {
            const user_id = (Auth.payload as AuthPayLoad).id
            await PhotoService.setAvatar(photo_id, user_id)
            set.status = "No Content"

        } catch (error) {
            set.status = "Bad Request"
            if (error instanceof Error)
                throw error
            throw new Error("Something went wrong, try again later !!")
        }

    }, {
        detail: { summary: "Set Avatar" },
        isSignIn: true,
        params: "photo_id"
    })

    .delete('/:photo_id', async ({ params: { photo_id }, set }) => {
        try {
            await PhotoService.delete(photo_id)
            set.status = "No Content"
        } catch (error) {
            set.status = "Bad Request"
            if (error instanceof Error)
                throw error
            throw new Error("Something went wrong, try again later !!")
        }
    }, {
        detail: { summary: "Delete photo by photo_id" },
        isSignIn: true,
        params: "photo_id"
    })


    .get('/', async ({ Auth }) => {
        const user_id = (Auth.payload as AuthPayLoad).id
        return await PhotoService.getPhotos(user_id)
    }, {
        detail: { summary: "Get photo[] by user_id" },
        isSignIn: true,
        response: "photos"
    })

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

