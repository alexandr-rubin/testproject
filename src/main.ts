import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/configuration';
import { appSettings } from './app.settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configSerice = app.get(ConfigService<ConfigType>)
  
  appSettings(app)

  app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true,
  }))
  await app.listen(configSerice.get('PORT'))
}
bootstrap();
