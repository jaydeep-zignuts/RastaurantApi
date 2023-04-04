import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CategoryEntity } from "./category.entity";

@Entity({name:'item_restaurant'})
export class ItemEntity extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    item_name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    image: string;

    @Column()
    displayOrder: number;

    @ManyToOne(()=>CategoryEntity, (cate)=>cate.category, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'category_id'})
    category_id: CategoryEntity[]

}