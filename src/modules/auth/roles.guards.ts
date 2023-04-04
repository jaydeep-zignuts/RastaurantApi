import { CanActivate, ExecutionContext, Injectable, Res } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Response } from "express";
import { UserService } from "../user/user.service";
import { log } from "console";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector, private userService  : UserService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const roles = this.reflector.get<string[]>('roles', context.getHandler())
        const request = context.switchToHttp().getRequest();
        console.log("myroles",roles);
        console.log(request.user);
        
        // let res:Response;
        if(request?.user){
            
            const { id } = request.user;
            const user = await this.userService.getUserById(id);
            console.log("role" ,user.role );
            return roles.includes(user.role)
        }
        
        return false;
 
    } 

}  