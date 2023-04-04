import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { log } from "console";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserEntity } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
   constructor(
      @InjectRepository(UserEntity) private userRepository:Repository<UserEntity>
   ) {
      super({
         jwtFromRequest: function(req) {
            var jwt = null;
            if (req && req.cookies)
            {
                jwt = req.cookies['jwt'];
            }
            return jwt;
        }, 
         secretOrKey: 'secret',

      })
   }
   async validate(payload: any){
      const user = await this.userRepository.findOne({where:{email: payload.email}})
      console.log("validate",user);
      
      return {
         id: payload.id,
         user: user
      }
   }

}