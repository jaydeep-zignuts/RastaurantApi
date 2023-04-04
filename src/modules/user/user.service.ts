import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDto } from "src/dto/user.dto";
import { UserEntity } from "src/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Response } from "express";
import { CategoryEntity } from "src/entities/category.entity";
import { count, group, log } from "console";
import { ItemEntity } from "src/entities/item.entity";
import { reverse } from "dns";


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
        @InjectRepository(ItemEntity) private itemRepository: Repository<ItemEntity>,

    ) { }

    async createUser(user: UserDto, res: Response) {
        try {
            const salt = await bcrypt.genSalt();
            const password = await bcrypt.hash(user.password, salt)
            const userData = await this.userRepository.create({
                user_name: user.user_name,
                email: user.email,
                password: password
            }).save()
            return res.status(HttpStatus.OK).json({
                status: 200,
                data: userData
            });
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 500,
                message: e.message
            })
        }
    }
    async getUserById(id: number) {
        const admin = await this.userRepository.findOne({ where: { id } });
        return admin;
    }
    async findUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email: email } })
        return user;
    }
    async allItems(res: Response) {

        try {
            const data:any = {};
            // const items = await this.categoryRepository.find({relations:['category']});
            const items = await this.categoryRepository.createQueryBuilder('c')
            .leftJoinAndSelect('c.category','ci')
            .leftJoinAndSelect('ci.category_id','cat')
            .orderBy('ci.displayOrder',"ASC")
            .getMany()
            // const items= await this.itemRepository.find({relations:['category_id'], order:{displayOrder:'DESC'} })
            data.items =  items

             data.items.map((item)=>{
                console.log(item);
                
                item.count= item.category.length;
            
                // item.count =item.category_id.length
                return item
             })
            
            
            return res.status(HttpStatus.OK).json({
                status: 200,
                data: data
            });

        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 500,
                message: e.message
            });
        }
    }
}
