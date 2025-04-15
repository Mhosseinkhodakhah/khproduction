import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"



@Entity()
export class installments {

    @PrimaryGeneratedColumn()
    id : number;


    @Column({type : 'varchar'})
    firstName : string;

    
    @Column({type : 'varchar'})
    lastName : string;


    @Column({type : 'varchar'})
    nationalCode : string;


    @Column({type : 'varchar'})
    phoneNumber : string;


    @Column({type : 'varchar' , nullable : true})
    category : string;                              // 0: alangoo   1 : dastband    2 : gooshvare   3 : zanjir    4 : medal   5 : service


    @Column({type : 'varchar'})
    time : string;

    @Column({type : 'varchar'})
    date : string;

    @Column({type : 'varchar' , nullable : true})
    city : string;

    @Column({type : 'varchar' , nullable : true})
    province : string;

    @Column({type : 'int' , default : 2})
    status : number                 // 0 : reject      1 : checked    2 : pending 

    @Column({type : 'varchar' , nullable : true})
    describtion:string


    @Column({type : 'varchar' , nullable : true})
    admin : string;

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;

    @DeleteDateColumn()
    deletedAt:Date;

}
