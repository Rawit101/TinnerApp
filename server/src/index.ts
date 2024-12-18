import { Elysia, t } from "elysia"
import { example } from "./controller/example.controller"
import { swaggerConfig } from "./config/swagger.config"
import { tlsConfig } from "./config/tls.config"
import cors from "@elysiajs/cors"
import { MongoDB } from "./config/database.config"
import { jwtConfig } from "./config/jwt.config"
import { model } from "mongoose"
import { AccountController } from "./controller/account.controller"
import { UserController } from "./controller/user.controller"
import { photoController } from "./controller/photo.controller"
import staticPlugin from "@elysiajs/static"
import { ImageHelper } from "./helper/image.helper"
import { LikeController } from "./controller/like.controller"


MongoDB.connect()

const app = new Elysia()

  .use(staticPlugin({
    assets: "public/uploads",
    prefix: "img"
  }))

  .use(LikeController)
  // .use(staticPlugin)
  .use(photoController)
  .use(AccountController)
  .use(cors())
  .use(jwtConfig)
  .use(swaggerConfig)
  .use(example)
  .use(UserController)
  .listen({
    port: Bun.env.PORT || 8000,
    tls: tlsConfig
  })

let protocol = 'http'
if ('cert' in tlsConfig)
  protocol = 'https'
console.log(`🦊 Elysia is running at ${protocol}://${app.server?.hostname}:${app.server?.port}`)
