import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class handleGoldPrice{

    @PrimaryGeneratedColumn({type : 'int'})
    id : number

    @Column({type : 'bool' , default : false})
    active : boolean

    @Column({type : 'int' , default : 0})
    price : number

    @BeforeInsert()
    @BeforeUpdate()
    updateDates() {
        if (this.price > 0){
            this.active = true;
        }else { 
            this.active = false;
        }
    }

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;

    @DeleteDateColumn()
    deletedAt : Date;

}