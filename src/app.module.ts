import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmAsyncConfig } from './config/typeorm.config';
import { AdminModule } from './modules/admin/admin.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ 
    UserModule,
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync(TypeOrmAsyncConfig),
    AuthModule,
    AdminModule, 
    {
      ...JwtModule.register({
        secret:process.env.APP_SECRET,
        signOptions:{
            expiresIn: '1d',
        },
      }),
      global: true
    },
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
