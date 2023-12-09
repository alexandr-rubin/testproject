import { useContainer } from "class-validator"
import * as cookieParser from 'cookie-parser'
import { AppModule } from "./app.module"
import { INestApplication } from "@nestjs/common"

export const appSettings = (app: INestApplication) => {
  app.use(cookieParser())
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  
  app.enableCors()
}