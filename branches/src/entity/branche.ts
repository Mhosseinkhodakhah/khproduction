import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm"
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


}
