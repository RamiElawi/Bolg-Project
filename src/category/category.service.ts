import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private readonly catRepo:Repository<Category>){}
  
  async create(createCategoryDto: CreateCategoryDto) {
    // return await this.catRepo.insert(createCategoryDto)
    const cat=new Category()
    Object.assign(cat,createCategoryDto)
    await this.catRepo.create(cat)
    return await this.catRepo.save(cat)
  }

  async findAll() {
    return await this.catRepo.find()
  }

  async findOne(id: number) {
    const cat=await this.catRepo.findOneBy({id:id})
    if(!cat) throw new BadRequestException('this category is not found')
      return cat;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id)
    return await this.catRepo.update(id,updateCategoryDto)
  }

  async remove(id: number) {
    await this.findOne(id)
    return await this.catRepo.delete(id)
  }
}
