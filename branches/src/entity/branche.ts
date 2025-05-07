import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { sellers } from "./sellers";

@Entity()
export class branche {

    @PrimaryGeneratedColumn()
    id : number

    @Column({type : 'varchar'})
    name : string;

    @Column({type : 'varchar'})
    code : string;

    @Column({type : 'varchar'})
    manager : string;

    @OneToMany(()=>sellers , sellers=>sellers.branch)
    @JoinColumn()
    sellers : sellers[]

    @Column({type : 'bool' , default : true})
    isActive : boolean

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

}
