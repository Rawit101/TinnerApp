import { Photo } from "./photo"

export interface User {
    id?: string
    display_name?: string
    username?: string
    created_at?: Date
    update_at?: Date
    last_active?: Date
    introduction?: string
    interest?: string
    looking_for?: string
    gender?: string
    age?: string
    avatar?: string
    photos?: Photo[]
    photoOfTheDay?: string
    location?: string

    following?: User[] | string[]
    followers?: User[] | string[]

    password?: string

}
