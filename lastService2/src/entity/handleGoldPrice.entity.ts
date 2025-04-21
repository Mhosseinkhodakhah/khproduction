import { AfterInsert, BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class handleGoldPrice{

    @PrimaryGeneratedColumn({type : 'int'})
    id : number

    @Column({type : 'bool' , default : false})
    active : boolean

    @Column({type : 'int' , default : 0})
    price : number

    @AfterInsert()
    updateDates() {
        if (this.price > 0){
            this.active = true;
        }
    }

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;

    @DeleteDateColumn()
    deletedAt : Date;

}