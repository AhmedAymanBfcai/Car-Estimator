import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './gurads/auth.gurd';
const cookieSession = require('cookie-session'); // A configuration mismatch between our nest project and cookie session itself. 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalGuards(new AuthGuard());
  app.use(cookieSession({
    keys: ['iamacookie']
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    }),
  );

  await app.listen(3000); 
}

bootstrap();