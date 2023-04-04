import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryDto } from 'src/dto/category.dto';
import { CategoryEntity } from 'src/entities/category.entity';
import { ItemEntity } from 'src/entities/item.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([UserEntity, CategoryEntity, ItemEntity])
    ],
    providers:[UserService],
    controllers:[UserController],
    exports:[UserService]
})
export class UserModule {}
