import { User } from "../_models/user"

const defaultImage = '/assets/default.png'
const defaultAvatar = '/assets/profile.png'
function getAvater(user: User): string {
    if (user.photos) {
        const avatar = user.photos.find(p => p.is_avatar === true)
        if (avatar)
            return avatar.url
    }
    return defaultAvatar
}

function getPhotoOfTheDay(user: User): string {
    if (user.photos && user.photos.length > 0) {
        const index = Math.floor(Math.random() * user.photos.length)
        return user.photos[index].url
    }
    return defaultImage
}

export function parseUser(user: User): User {
    user.avatar = getAvater(user)
    user.photoOfTheDay = getPhotoOfTheDay(user)
    return user
}