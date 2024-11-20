import { Elysia, t } from "elysia"
import { example } from "./controller/example.controller"
import { swaggerConfig } from "./config/swagger.config"
import { tlsConfig } from "./config/tls.config"
import cors from "@elysiajs/cors"
import { MongoDB } from "./config/database.config"
import { jwtConfig } from "./config/jwt.config"
import { model } from "mongoose"
import { AccountController } from "./controller/account.controller"


MongoDB.connect()

const app = new Elysia()
  .use(AccountController)
  .use(cors())
  .use(jwtConfig)
  .use(swaggerConfig)
  .use(example)
  .listen({
    port: Bun.env.PORT || 8000,
    tls: tlsConfig
  })

let protocol = 'http'
if ('cert' in tlsConfig)
  protocol = 'https'
console.log(`🦊 Elysia is running at ${protocol}://${app.server?.hostname}:${app.server?.port}`)
