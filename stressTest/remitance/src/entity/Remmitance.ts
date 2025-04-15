import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./User"
import {RemmitanceType} from "./enums/RemmitanceType"



@Entity()
export class Remmitance {
    @PrimaryGeneratedColumn()
    id : number

    @ManyToOne(()=> User , (user)=> user.sells,{nullable:true})
    seller : User
   
    @ManyToOne(()=> User , (user)=> user.buys,{nullable:true})
    buyer : User
    
    @Column({ type: "numeric", precision: 10, scale: 0,default : 0 })
    goldPrice : number

    @Column({ type: "numeric", precision: 10, scale: 3, default: 0 })
    goldWeight : number

    @Column({ type: "numeric", precision: 10, scale: 0,default : 0 })
    totalPrice : number
    
    @Column({nullable : true})
    authority : string

    @Column({nullable : true})
    invoiceId : string

    @Column({nullable : true})
    status : string 

    @Column()
    date : string

    @Column()
    time : string

    @Column()
    type : RemmitanceType
     
    @Column({nullable:true,default:false , type : 'bool'})
    fromPhone : boolean

    @Column({nullable:true,default:""})
    adminId:string

    @Column({default:3})
    tradeType:number

    @Column({nullable:true,default:""})
    accounterId:string

    @Column({nullable:true,default:"",type:"varchar"})
    description:string

    @Column({nullable:true,default:"",type:"varchar"})
    accounterDescription:string

    @Column({nullable:true,default:"",type:"varchar"})
    originCardPan:string

    @Column({nullable:true,default:"",type:"varchar"})
    destCardPan:string

    @CreateDateColumn()
    createdAt: Date
    
    @UpdateDateColumn()
    updatedAt : Date
           
    @DeleteDateColumn()
    deletedAt : Date

}