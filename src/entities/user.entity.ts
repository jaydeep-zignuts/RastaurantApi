import { BaseEntity, Column, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'user_restaurant'})
export class UserEntity extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    user_name: string;

    @Column({unique:true})
    email: string;

    @Column()
    password: string;

    @Column({default:'user'})
    role: string;
}
