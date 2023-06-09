import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt'
import { Repository } from "typeorm";
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from "src/entities/user.entity";

@Injectable()
export class AuthService{
    constructor(
        @InjectRepository(UserEntity) private userRepository : Repository<UserEntity>,
        private jwtService: JwtService
    ){}
    async validateUserCreds(email: string, password: string): Promise<any> {
        const userdata = await this.userRepository.findOne({where:{email : email}})
        if (!userdata) throw new BadRequestException();

        if (!(await bcrypt.compare(password, userdata.password))) throw new UnauthorizedException();
        return userdata;
   
}

async generateToken(user: any, response
) {

    const jwt = this.jwtService.sign({
        id: user,
    })
    
    response.cookie('jwt', jwt, { httpOnly: true });
    return jwt;
}
}


