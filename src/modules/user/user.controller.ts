import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseFilters, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { UserDto } from "src/dto/user.dto";
import { UserEntity } from "src/entities/user.entity";
import { UserService } from "./user.service";
import { Roles } from "../auth/roles.decorators";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guards";
import { AdminRoleGuard } from "../auth/admin-role.guard";

@Controller('user')
export class UserController{
    constructor(private userService: UserService){}

    @Post('create')
    async createUser(@Body() user: UserDto, @Res() res: Response){
        return await this.userService.createUser(user,res);
    }

    @Get('items')
    @UseGuards(JwtAuthGuard, RolesGuard)

    @Roles("user")
    async allItems(@Res() res:Response){
        return await this.userService.allItems(res);
    }

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    async logout(@Res() res:Response){
        try{
        res.clearCookie('jwt')
        return res.status(HttpStatus.OK).json({
            status: 200,
            message: 'Logged out Successfully'
        })
        }catch(e){
            return res.status(500).json({
                status:500,
                message:e
            })
        }
    }
}