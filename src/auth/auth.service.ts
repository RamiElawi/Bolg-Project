import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CustomRepositoryCannotInheritRepositoryError, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'
import {JwtService} from '@nestjs/jwt'



@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    private jwtService:JwtService
){}

  async login(userLoginDto:UserLoginDto){
    const user=await this.userRepo.createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.email = :email',{email:userLoginDto.email})
    .getOne()

    if(!user) throw new UnauthorizedException('this email is not found')

    if(!await this.verifyPassword(userLoginDto.password,user.password))
      throw new UnauthorizedException('this password is not correct')
    
    const token= await this.jwtService.signAsync({
      email:user.email,
      id:user.id
    })
    delete user.password;
    // console.log(token)
    return {accessstoken:token,user:user}
    
  }

  async verifyPassword(password:string,hash:string){
    return await bcrypt.compare(password,hash)
  }


  async singup(createUserDto:CreateUserDto){
    const {email}=createUserDto
    const isExist=await this.userRepo.findOneBy({email:email})
    if(isExist) throw new BadRequestException('this email is already exist')
    const user=new User()
    Object.assign(user,createUserDto)
    await this.userRepo.create(user)
    await this.userRepo.save(user)
    delete user.password
    return user
  }

}
