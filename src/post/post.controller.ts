import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, Req, Query, UseGuards, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import {Request, Response} from 'express'
import { CurrentUserGuard } from 'src/auth/guard/current-user.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { File } from 'buffer';
import { ACGuard, UseRoles } from 'nest-access-control';

@Controller('post')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'),ACGuard)
  @UseRoles({
    possession:'any',
    action:'create',
    resource:'posts'
  })
  create(@Body() createPostDto: CreatePostDto,@Req() req:Request,@CurrentUser() user:User) {
    console.log(req.user)
    return this.postService.create(createPostDto,user);
  }

  @Get()
  // @UseGuards(AuthGuard('jwt'))
  @UseGuards(CurrentUserGuard)
  findAll(@Query() query:any,@CurrentUser() user:User) {
    console.log(user)
    return this.postService.findAll(query);
  }
  
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postService.find(id);
  }

  @Get('/slug/:slug')
  async findOneBySlug(@Param('slug') slug: string) {
    return await this.postService.findBySlug(slug);
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(slug, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }

  @Post('/uploadPhoto')
  @UseInterceptors(FileInterceptor('file',{
    storage:diskStorage({
      destination:'./uploads',
      filename:(req:Request, file, cb)=> {
          const name=file.originalname.split('.')[0];
          const fileExtension=file.originalname.split('.')[1];
          const newFileName=name.split(" ").join('-')+'_'+Date.now()+'.'+fileExtension
          cb(null,newFileName)
      },
    }),
    fileFilter:(req, file, cb)=>{
          if(!file.originalname.match(/\.(jpg|jped}png|gif)$/))
            return cb(null,false)
          return cb(null,true)
      },
  }))
  uploadPhoto(@UploadedFile() file:Express.Multer.File){
    console.log(file)
    if(!file)
      throw new BadRequestException('File is not an image')

    const response={
      filePath:`http://localhost:3000/post/pictures/${file.filename}`
    }
    return response
  }

  @Get('pictures/:filename')
  async getPicture(@Param('filename') filename,@Res() res:Response){
    res.sendFile(filename,{root:'./uploads'})
  }
}
