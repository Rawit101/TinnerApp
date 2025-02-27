import mongoose, { Types } from "mongoose"
import { IPhotoDocument, IPhotoModel } from "../interfaces/photo.interface"
import { Required, Type } from "@sinclair/typebox"
import { photo } from "../types/photo.type"

const schema = new mongoose.Schema<IPhotoDocument, IPhotoModel>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    public_id: { type: String, required: true },
    url: { type: String, required: true },
    is_avatar: { type: Boolean, required: true, default: false },

}, {
    timestamps: { createdAt: 'create_at' }

})

schema.methods.toPhoto = function (): photo {
    return {
        id: this._id.toString(),
        url: this.url,
        public_id: this.public_id,
        is_avatar: this.is_avatar,
        create_at: this.create_at,
    }
}

schema.statics.setAvatar = async function (photo_id: string, user_id: string): Promise<boolean> {
    this.updateMany(
        { user: new mongoose.Types.ObjectId(user_id) },
        { $set: { is_avatar: false } }
    )
    const updatePhoto = await this.findByIdAndUpdate(
        photo_id,
        { $set: { is_avatar: true } }
    )
    return !!updatePhoto
}

export const Photo = mongoose.model<IPhotoDocument, IPhotoModel>("Photo", schema)