import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"




@Entity()
export class cooperation {
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

    @Column({type : 'varchar'})
    birthDate : string;

    @Column({type : 'varchar'})
    city : string;

    @Column({type : 'varchar'})
    municipalArea : string;

    @Column({type : 'varchar' , nullable : true , default : ''})
    relevantExperience : string

    @Column({type : 'varchar' , nullable : true , default : ''})
    motivation : string;

    @Column({type : 'int'})
    howToKnow : number;             // 0 : website   1:instagram   2 : telegram    3 : friends   4 : other

    @Column({type : 'varchar'})
    interests : string;

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;

    @DeleteDateColumn()
    deletedAt : Date;

}
