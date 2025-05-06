import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity()
export class systemSetting{

    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : 'int' , default : 1})
    tradePermision : number;


    @Column({type : 'varchar' , default : 'default admin'})
    admin : string


    @CreateDateColumn()
    craetedAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;
    
}