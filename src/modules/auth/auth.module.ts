import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.startegy';
import { LocalStrategy } from './local.strategy';


@Module({
    imports:[TypeOrmModule.forFeature([ UserEntity ]), PassportModule,

    UserModule,
    JwtModule.register({
        secret:'secret',
        signOptions:{
            expiresIn: '1d',
        },
        
    }), 
    ],
    providers:[AuthService, JwtStrategy, LocalStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
    
    