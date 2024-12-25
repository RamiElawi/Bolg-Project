import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Category } from "src/category/entities/category.entity";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty({message:'the title should not be empty bb'})
    title:string;
    @IsString()
    @IsNotEmpty()
    content:string;
    // @IsString()
    slug:string;
    
    @IsString()
    @IsNotEmpty()
    mainImageUrl:string
    
    @IsOptional()
    @IsNumber()
    categoryId:number
    
    @IsOptional()
    category:Category
    userId:number
}
