import Elysia, { Static, t } from "elysia"
import { register } from "./account.types"
import { _register } from "./register.type"
import { _pagination, CreatePagination } from "./pagination.type"
import { User } from "../models/user.model"

export const _profile = t.Object({
    ...t.Omit(_register, ['password']).properties,
    id: t.String(),
    introduction: t.Optional(t.String()),
    interest: t.Optional(t.String()),
    location: t.Optional(t.String()),
    age: t.Optional(t.String()),
    last_active: t.Optional(t.String()),
    create_at: t.Optional(t.String()),
    update_at: t.Optional(t.String())

    //todo: implement upload feature                                                                                    
    //photo: photo_id[]
})

export const _user = t.Object({
    ..._profile.properties,
    //todo: implement upload feature                                                                                    
    //follower:
    //followeing:
})



const _userPagination = t.Object({
    ..._pagination.properties,
    username: t.Optional(t.String()),
    min_age: t.Optional(t.Number()),
    max_age: t.Optional(t.Number()),
    looking_for: t.Union([t.Literal('male'), t.Literal('female'), t.Literal('all')]),
})
export const _updateProfile = t.Omit(_profile, ['id', 'username', 'update_at', 'crate_at', 'last_active', 'age'])
export const _userPaginator = CreatePagination(_user, _userPagination)

export const UserDto = new Elysia().model({
    pagination: t.Optional(_userPagination),
    updateProfile: _updateProfile,
    users: _userPaginator,
    user: _user
})

export type _updateProfile = Static<typeof _updateProfile>
export type _userPagination = Static<typeof _userPagination>
export type _userPaginator = Static<typeof _userPagination>
export type user = Static<typeof _user>
