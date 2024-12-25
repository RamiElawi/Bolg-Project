
import { Post } from "src/post/entities/post.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcryptjs'
import { Exclude } from "class-transformer";
import { UserRoles } from "../user.roles";
@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    firstName:string;
    @Column()
    lastName:string;
    @Column()
    email:string;
    @Column({select:false})
    // @Exclude()
    password:string;
    @Column()
    profilePic:string;

    @Column({type:'enum',enum:UserRoles,default:UserRoles.Reader})
    roles:UserRoles

    @OneToMany(()=>Post,post=>post.user)
    posts:Post[]    

    @BeforeInsert()
    hashPassword(){
        this.password=bcrypt.hashSync(this.password,10)
    }
}
