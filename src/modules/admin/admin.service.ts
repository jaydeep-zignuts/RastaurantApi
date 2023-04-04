import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { count, group, log } from "console";
import { Response } from "express";
import { groupBy } from "rxjs";
import { CategoryDto } from "src/dto/category.dto";
import { ItemDto } from "src/dto/item.dto";
import { CategoryEntity } from "src/entities/category.entity";
import { ItemEntity } from "src/entities/item.entity";
import { Repository } from "typeorm";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
        @InjectRepository(ItemEntity) private itemRepository: Repository<ItemEntity>,

    ) { }

    async addCategory(category: CategoryDto, res: Response) {
        try {

            const categoryData = await this.categoryRepository.create({
                category_name: category.category_name
            }).save();
            // categoryData.save();
            return res.status(HttpStatus.OK).json({
                status: 200,
                data: categoryData
            })
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 500,
                message: e.message
            })
        }
    }
    async getCategories(res: Response) {
        try {
            const categories = await this.categoryRepository.find({});
            console.log(categories);

            return res.status(HttpStatus.OK).json({
                status: 200,
                data: categories
            })
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 500,
                message: e.message
            })
        }
    }

    async updateCategory(cid: number, res: Response, category: CategoryDto) {
        try {
            const updated = await this.categoryRepository.update({ id: cid }, { category_name: category.category_name });
            return res.status(HttpStatus.OK).json({
                status: 200,
                data: updated
            });
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 500,
                message: e.message
            })
        }
    }

    async deleteCategory(cid:number, res:Response){
        try{
            const deleted = await this.categoryRepository.delete({id:cid});
            return res.status(HttpStatus.OK).json({
                status: 200,
                data: deleted
            });
        }catch(e){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 500,
                message: e.message
            })
        }
    }

    async addItem(item :ItemDto ,res:Response, cid:number, file: string){
        try{
            const category = await this.categoryRepository.findOne({where:{id:cid}, relations:['category']});
            console.log("Category id::: ", category.id);
            const itemData= await this.itemRepository.create({
                item_name:item.item_name,
                description: item.description,
                price: item.price,
                image: file,
                displayOrder: item.displayOrder
            }).save();

            category.category=[itemData, ...category.category];
            // itemData.category_id=[category, ...itemData.category_id];
            await category.save();
            await itemData.save();
            return res.status(HttpStatus.OK).json({
                status: 200,
                data: itemData
            });

        }catch(e){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 500,
                message: e.message
            })
        }
    }

    async getItems(items:ItemDto, res:Response){
        try{
            const itemData=await this.categoryRepository.find({relations:['category']});
            return res.status(HttpStatus.OK).json({
                status: 200,
                data: itemData
            });

        }catch(e){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 500,
                message: e.message
            })
        }
    }
    async deleteItem(iid:number, res:Response){
        try{
            const deleteItem = await this.itemRepository.delete({id:iid});
            return res.status(HttpStatus.OK).json({
                status: 200,
                data: deleteItem
            });
        }catch(e){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 500,
                message: e.message
            })
        }
    }

    async updateItem(iid:number, res:Response, item: Partial<ItemDto>, file:string){
        try{
            const updateItem = await this.itemRepository.update({ id: iid},{
                item_name:item.item_name,
                description: item.description,
                price: item.price,
                displayOrder:item.displayOrder,
                image:file
                
            });
            return res.status(HttpStatus.OK).json({
                status: 200,
                data: updateItem
            });
            
        }catch(e){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 500,
                message: e.message
            })
        }
    }
    async allItems(page:number, take:number, category_name:string, res:Response){
        console.log(category_name);
        
        if(category_name){
            try{
                // const itemData=await this.categoryRepository.find({where:{category_name: category_name},relations:['category']  });
                const itemData=await this.categoryRepository.createQueryBuilder('c').leftJoinAndSelect('c.category','ci').where('c.category_name = :cat', {cat: category_name}).getOne();
                // const itemData=await this.itemRepository.createQueryBuilder('it').leftJoinAndSelect('it.category_id','it_cid').where('it_cid.category_name = :cat', {cat: category_name}).getMany();

                return res.status(HttpStatus.OK).json({
                    status: 200,
                    // totalItems:itemData,
                    data: {itemData, count: itemData.category.length}
                });
                
            }catch(e){
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 500,
                    message: e.message
                })
            }
        }else{
            try {
                take = take || 4;
                page = page || 1;
                const skip = (page - 1) * take;
                const items=await this.categoryRepository.createQueryBuilder('c')
                .leftJoinAndSelect('c.category','ci')
                .take(take)
                .skip(skip)
                .getOne();

                // const items = await this.itemRepository.find({
                //     relations: ['category_id'],
                //     take: take,
                //     skip: skip
                // },
                
                // );
                // const totItems = items.length
                
                return res.status(HttpStatus.OK).json({
                    status: 200,
                    
                    data: {count: items.category.length, items},
                });
            } catch (e) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 500,
                    message: e.message
                });
            }
        }
    }
}