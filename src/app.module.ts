import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/users.entity';
import { Report } from './reports/report.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session'); // A configuration mismatch between our nest project and cookie session itself. 

@Module({
  imports: [ 
    ConfigModule.forRoot({ 
      isGlobal: true, // Means that we don't have to import the config module all over the place into other modules inside ofa project when we need to get some config information.
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true, //Only for use in dev mode. Automatic migration stuff..
        }
      },
  }), UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true })}], //It's called global pipe -> Whenver we creat ean instance of out app module automatically make use of this value for every incoming request(pipe)
})

export class AppModule {
  // This config func will be called aumtomatically whenver our app starts listing for incoming traffic. 
  configure(consumer: MiddlewareConsumer) {
    // Setting up some middleware that will run on eery single incoming request:
    consumer.apply(cookieSession({
      keys: ['iamacookie'],
    })).forRoutes('*') // It means that we want to make use of this middleware on every single incoming request "It's a global middleware".
  }
}
