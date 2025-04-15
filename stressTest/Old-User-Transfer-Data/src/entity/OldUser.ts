import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm";



@Entity()
export class OldUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: number;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({nullable:true})
    phone: string

    @Column({nullable:true})
    nationalcode : string
      
    @Column({type : 'float'})
    goldWallet: number 

    @Column({type:'float'})
    moneyWallet : number

    @CreateDateColumn()
    createdAt : Date
    
    @UpdateDateColumn()
    updatedAt : Date
    
    @DeleteDateColumn()
    deletedAt : Date

}

