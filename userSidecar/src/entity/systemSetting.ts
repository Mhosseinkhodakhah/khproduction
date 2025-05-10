import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class systemSetting{

    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : 'int' , default : 1})
    tradePermision : number;

    @Column({type : 'int' , default : 1})
    registerPermision : number;

    @Column({type : 'int' , default : 1})
    depositPermision : number;

    @Column({type : 'int' , default : 1})
    withdrawPermision : number;

    @Column({type : 'varchar' , default : 'default admin'})
    admin : string

    @CreateDateColumn()
    craetedAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;
    
}