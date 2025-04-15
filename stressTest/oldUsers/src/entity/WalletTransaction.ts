import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Wallet } from "./wallet";

@Entity()
export class WalletTransaction{
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    type : string

    @Column()
    description :string

    @OneToMany(()=> Wallet , (wallet)=> wallet.transactions)
    wallet : Wallet
    
    @Column({ type: "numeric", precision: 10, scale: 1 ,default : 0 })
    amount : number

    @Column()
    status : string
}