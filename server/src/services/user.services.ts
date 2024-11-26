import mongoose, { get, RootFilterQuery } from "mongoose"
import { _updateProfile, _userPagination, _userPaginator, user } from "../types/user.type"
import { IUserDocument } from "../interfaces/user.interface"
import { QueryHelper } from "../helper/query.helper"


export const UserService = {
    get: function (pagination: _userPagination, user_id: string): Promise<_userPaginator> {
        let filter: RootFilterQuery<IUserDocument> = {
            _id: { $nin: new mongoose.Types.ObjectId(user_id) },
            $and: QueryHelper.parseUserQuery(pagination)
        }
    },

    getByUserName: function (username: string): Promise<user> {
        throw new Error('Not Implement')
    },

    updateProfile: function (newProfile: _updateProfile, user_id: string): Promise<user> {
        throw new Error('Not Implement')
    }
}