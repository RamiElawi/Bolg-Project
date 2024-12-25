import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {Post} from 'src/post/entities/post.entity'
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable() 
export class PostService {
  constructor(@InjectRepository(Post) private readonly postRepo:Repository<Post>){}


  async create(createPostDto: CreatePostDto,user:User) {
    // const slug=createPostDto.title.split(" ").join('_').toLowerCase();
    // return await this.postRepo.insert({...createPostDto})
    const post=new Post();
    post.userId=user.id;
    Object.assign(post,createPostDto)
    await this.postRepo.create(post)
    return await this.postRepo.save(post)
  }

  async findAll(query?:string):Promise<Post[]>{
      const myQuery=this.postRepo.createQueryBuilder('post')
      .leftJoinAndSelect('post.category','category')
      .leftJoinAndSelect('post.user','user')
      if(!(Object.keys(query).length==0)&& query.constructor==Object){
        const queryKeys=Object.keys(query)
        if(queryKeys.includes('title')){
          myQuery.where('post.title LIKE :title',{title:`%${query['title']}%`})
        }

        if(queryKeys.includes('sort')){
          myQuery.orderBy('post.title ',query['sort'].toUpperCase())
        }
        
        if(queryKeys.includes('category')){
          myQuery.andWhere('post.title LIKE :cat',{cat:query['category']})
        }
        return await myQuery.getMany()
      }else{
        return await  myQuery.getMany()
      }
  }

  async findBySlug(slug:string){
    try{
      const post=await this.postRepo.findOneByOrFail({slug:slug})
      return post
    }catch(err){
       throw new BadRequestException(`post with slug ${slug} is not found`)
    }
  }

  async find(id: number) {
    const post=await this.postRepo.findOneBy({id:id})
    console.log(post)
    if(!post) {console.log('here')
      throw new BadRequestException('this post is not found')}
    return post
    }

  async update(slug: string, updatePostDto: UpdatePostDto) {
      const post =await this.findBySlug(slug)
      post.modifiedOn=new Date(Date.now())
      post.categoryId=updatePostDto.categoryId

      Object.assign(post,updatePostDto)
      return await this.postRepo.save(post)
    }

  async remove(id: number) {
    const post=await this.find(id)
    await this.postRepo.remove(post)
    return {success:true,post}
  }
}
