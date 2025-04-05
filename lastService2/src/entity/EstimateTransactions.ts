import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class EstimateTransactions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type : 'varchar' , default : '0'})
    boughtGold : string;

    @Column({type : 'varchar' , default : '0'})
    soldGold : string;

    @Column({type : 'varchar' , nullable : true})
    date : string;

    @Column({type : 'varchar' , nullable : true})
    month : string;

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;

    @DeleteDateColumn()
    deletedAt : Date;

}
