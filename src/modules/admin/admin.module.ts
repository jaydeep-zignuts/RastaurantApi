import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities/category.entity';
import { ItemEntity } from 'src/entities/item.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserEntity } from 'src/entities/user.entity';
import { AdminRoleGuard } from '../auth/admin-role.guard';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
    imports:[TypeOrmModule.forFeature([CategoryEntity, ItemEntity, UserEntity]),UserModule],
    providers:[AdminService],
    controllers:[AdminController]
})
export class AdminModule {}
 