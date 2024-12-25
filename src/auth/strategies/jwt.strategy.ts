import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import {Request} from 'express'
import { UnauthorizedException } from "@nestjs/common";

export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@InjectRepository(User) private readonly userRepo:Repository<User>){
        super({
            ignoreExpiration:false,
            secretOrKey:'2afb7a1434b7b141e0e398c4b6c1fa250b87170c9e29c88848ad29de2dd5ebcbfaaa328b47e57c715771c3686d29a43fd7a90febf2af73b70189ce46a264deec'
            ,jwtFromRequest:ExtractJwt.fromExtractors([(req:Request)=>{
                return req?.cookies?.Authentication
            }])
        })
    }

    async validate(payload:any,req:Request){
        if(!payload){
            throw new UnauthorizedException()
        }
        const user=await this.userRepo.findOneBy({email:payload.email})
        if(!user) throw new UnauthorizedException()
        req.user=user
    return req.user;
    }

}