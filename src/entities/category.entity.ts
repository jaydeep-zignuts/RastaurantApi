import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ItemEntity } from "./item.entity";

@Entity({name:'category_restaurent'})
export class CategoryEntity extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    category_name: string;

    @OneToMany(()=>ItemEntity, (item)=>item.category_id)
    category: ItemEntity[];
 
}      