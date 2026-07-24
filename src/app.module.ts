import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { BrandModule } from './modules/brand/brand.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`],
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
        minPoolSize: 2,
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 3000,
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => console.log(`Database connected successfully`));
          connection.on('disconnected', () => console.log(`Database disconnected`));
          connection.on('disconnecting', () => console.log(`Database disconnecting...`));
          return connection
        }
      }),
      inject: [ConfigService],
    }),
    AuthenticationModule,
    UserModule,
    BrandModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes()
  }
}