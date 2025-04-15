import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { WalletTransaction } from "./WalletTransaction";


@Entity()
export class Wallet {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.wallet, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User;

    @Column({ type: "numeric", precision: 10, scale: 3, default: 0 })
    goldWeight: number;
    
    @Column({nullable : true , default : 0 , type : 'int'})
    balance: number;
    
    @ManyToOne(()=> WalletTransaction , (wt)=> wt.wallet)
    transactions: WalletTransaction[];
    
}

