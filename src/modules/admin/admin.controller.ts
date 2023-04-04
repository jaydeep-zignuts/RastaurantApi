import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { diskStorage } from "multer";
import { extname } from "path";
import { CategoryDto } from "src/dto/category.dto";
import { ItemDto } from "src/dto/item.dto";
import { AdminRoleGuard } from "../auth/admin-role.guard";
import { AdminService } from "./admin.service";
import { log } from "console";
import { Roles } from "../auth/roles.decorators";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guards";

@Controller('admin')
@UseGuards(JwtAuthGuard)

export class AdminController{
    constructor(
        private adminService: AdminService
    ){}
    



    //crud of category 
    @Post('addCategory')
    @UseGuards(AdminRoleGuard)

    async addCategory(@Body() category:CategoryDto, @Res() res: Response ){
        return await this.adminService.addCategory(category,res);
    }

    @Get('getCategory')
    @UseGuards(AdminRoleGuard)

    async getCategory(@Res() res: Response){
        return await this.adminService.getCategories(res);
    }

    @Patch('category/:id')
    @UseGuards(AdminRoleGuard)

    async updateCategory(@Param('id') cid: number,@Res() res: Response, @Body() category: CategoryDto){
        return await this.adminService.updateCategory(cid, res,category);
    }

    @Delete('category/:id')
    @UseGuards(AdminRoleGuard)

    async deleteCategory(@Param('id') cid: number,@Res() res: Response){
        return await this.adminService. deleteCategory(cid, res);
    }


    //crud of item
    //cid is id of category
    @Post('addItem/:cid')
    @UseGuards(AdminRoleGuard)

    @UseInterceptors(FileInterceptor('image',{
        storage: diskStorage({
            destination: './image',
            filename:(req, file, callback) =>{ 
              
              const uniqueSuffix=Date.now() + '-';
      
              const ext = extname(file.originalname);
              const filename = `${uniqueSuffix}${ext}`;
              console.log(uniqueSuffix, "is file name");
      
              callback(null, filename);
            }
          })
    })) 
    async additem(@Body() item:ItemDto, @Res() res: Response, @Param('cid') cid:number ,@UploadedFile() file: Express.Multer.File ){
        return await this.adminService.addItem(item,res, cid, file.filename);
    }


    @Get('getItems')
    // @UseGuards(RolesGuard)
    // @Roles('admin')
    @UseGuards(AdminRoleGuard)
    async getItems(@Body() item:ItemDto, @Res() res: Response){
        return await this.adminService.getItems(item, res);
    }

    @Patch('updateItem/:iid')
    @UseGuards(AdminRoleGuard)

    @UseInterceptors(FileInterceptor('image',{
        storage: diskStorage({
            destination: './image',
            filename:(req, file, callback) =>{ 
              
              const uniqueSuffix=Date.now() + '-';
      
              const ext = extname(file.originalname);
              const filename = `${uniqueSuffix}${ext}`;
              console.log(uniqueSuffix, "is file name");
      
              callback(null, filename);
            }
          })
    })) 
    async updateItem(@Param('iid') iid:number, @Res() res: Response, @Body() item: ItemDto,@UploadedFile() file: Express.Multer.File ){
        console.log("i",item);
        
        return await this.adminService.updateItem(iid, res,item, file.filename);
    }

    @Delete('deleteItem/:iid')
    @UseGuards(AdminRoleGuard)

    async deleteItem(@Param('iid') iid:number, @Res() res: Response ){
        return await this.adminService.deleteItem(iid, res);
    }
    // @Get('allUser')
    // async allUser(@Res() res:Response,  @Query() { page, take , user_name },){
    //     return await this.adminService.getAllUser(res ,page, take, user_name);
    // }
    @Get('items')
    @UseGuards(AdminRoleGuard)

    async allItems(@Res() res:Response,  @Query() { page, take , category_name }){
        return await this.adminService.allItems(page, take, category_name, res);
    }

}
