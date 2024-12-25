import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import {Request, Response} from 'express'
import { User } from './entities/user.entity';
import { CurrentUser } from './decorator/user.decorator';
import { CurrentUserGuard } from './guard/current-user.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async userRegister(@Body() createUserDto:CreateUserDto){
    return await this.authService.singup(createUserDto)
  }

  @Post("/login")
  async userLogin(@Body() userLoginDto:UserLoginDto,@Res() res:Response){
    const{accessstoken,user}=await this.authService.login(userLoginDto)
    res.cookie('IsAuthenticated',true,{maxAge:20*20*2000000})
    res.cookie("Authentication",accessstoken,{
      httpOnly:true,
      maxAge:20*20*2000000
    })
    return res.send({success:true,user})
  }


  @Get('/authStatus')
  @UseGuards(CurrentUserGuard)
  async authSatus(@CurrentUser() user:User){
    return {status:!!user,user}
  }

  @Post('/logout')
  async logout(@Req() req:Request,@Res() res:Response){
    res.clearCookie('Authentication') 
    res.clearCookie('IsAuthenticated') 
    return res.status(200).send({success:true})
  }

}
