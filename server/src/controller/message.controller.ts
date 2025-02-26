import Elysia, { error, t } from "elysia"
import { jwtConfig } from "../config/jwt.config"
import { AuthMiddleWare, AuthPayLoad } from "../middleware/auth.middleware"
import { message, MessageDto } from "../types/message.type"
import mongoose from "mongoose"
import { $ } from "bun"
import { Message } from "../models/message.model"

type client = {
    ws_id: string,
    user_id: string,
    group_name: string
}

const groupSubscriptions = new Map<string, Set<client>>()

export const MessageController = new Elysia({
    prefix: 'api/messages',
    tags: ['Message'],
})
    .use(jwtConfig)
    .use(AuthMiddleWare)
    .use(MessageDto)

    .ws('/ws', {
        async open(ws) {
            const token = ws.data.query.token
            const recipient_id = ws.data.query.recipient_id
            const payload = await ws.data.jwt.verify(token)
            if (!payload || !recipient_id) {
                ws.send({ sender: 'system', content: 'Unauthorized ❌❌🚷❗' })
                ws.close()
            }
            const user_id = (payload as AuthPayLoad).id
            const groupName = getGroupName(user_id, recipient_id!)

            ws.send({ sender: 'system', content: 'Connected ✅✅🔗🔗' })
            if (!ws.isSubscribed(groupName)) {
                ws.subscribe(groupName)

                if (!groupSubscriptions.has(groupName)) {
                    groupSubscriptions.set(groupName, new Set())
                }

                groupSubscriptions.get(groupName)?.add({
                    ws_id: ws.id,
                    user_id,
                    group_name: groupName
                })

            }
        },

        close(ws) {
            for (const clients of groupSubscriptions.values()) {
                for (const client of clients) {
                    if (client.ws_id === ws.id) {
                        ws.unsubscribe(client.group_name)
                        clients.delete(client)
                    }
                }
            }
        },

        async message(ws, message) {
            const msg = message as message
            if (!msg.sender || !msg.recipient || !msg.content) {
                ws.send({ sender: 'system', content: 'Invalid message ❌❌❌❗' })
                return
            }

            const groupName = getGroupName(msg.sender, msg.recipient)
            try {
                const newMessage = new Message({
                    sender: new mongoose.Types.ObjectId(msg.sender),
                    recipient: new mongoose.Types.ObjectId(msg.recipient),
                    content: msg.content
                })
                if (isRecipientConnected(groupName, msg.recipient)) {
                    newMessage.read_at = new Date()
                }

                await newMessage.save()
                const msgObj = newMessage.toMessage()
                ws.publish(groupName, msgObj)
                ws.send(msgObj)

            } catch (error) {
                ws.send({ sender: 'system', content: 'Something went wrong, fail to send Message ❌❌❌❗' })
                return
            }
        },
    })

    .get('/:target_id', async ({ Auth, params: { recipient_id }, query }) => {
        if (!query.pageSize || !query.currentPage)
            throw error(400)
        const user_id = (Auth.payload as AuthPayLoad).id
        const sender_ObjId = new mongoose.Types.ObjectId(user_id)
        const recipient_ObjId = new mongoose.Types.ObjectId(recipient_id)

        const filter = {
            $or: [
                { sender: sender_ObjId, recipient: recipient_ObjId, sender_delete: { $ne: true } },
                { sender: recipient_ObjId, recipient: sender_ObjId, recipient_delete: { $ne: true } },
            ]
        }
        const model = Message.find(filter).sort({ create_at: -1 })
        const skip = query.pageSize * (query.currentPage - 1)
        model.skip(skip).limit(query.pageSize)

        const [messageDocs, totalCount] = await Promise.all([
            model.exec(),
            Message.countDocuments(filter).exec()
        ])

        query.length = totalCount
        const messages = messageDocs.map(doc => doc.toMessage())

        await Message.updateMany({
            sender: recipient_ObjId,
            recipient: sender_ObjId,
            read_at: { $exists: false }
        }, {
            $set: { read_at: new Date() }
        })
        return {
            pagination: query,
            items: messages
        }

    }, {
        query: "pagination",
        response: "message",
        isSignIn: true,
        params: t.Object({
            recipient_id: t.String()
        })
    })

const getGroupName = function (sender: string, recipient: string): string {
    const compare = sender.localeCompare(recipient)
    if (compare < 0)
        return `${sender}-${recipient}`
    return `${recipient}-${sender}`
}

const constSubscription = function (group_Name: string): number {
    return groupSubscriptions.get(group_Name)?.size || 0
}

const isRecipientConnected = function (group_name: string, recipient: string): boolean {
    const clients = groupSubscriptions.get(group_name)
    if (clients)
        return Array.from(clients).find(client => client.user_id === recipient) !== undefined
    return false
}