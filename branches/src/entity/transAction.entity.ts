import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { sellers } from "./sellers";




@Entity()
export class transAction{

    @PrimaryGeneratedColumn()
    id : number

    @Column({type : 'int'})
    user : number
   
    
    @Column({ type: "numeric", precision: 10, scale: 0,default : 0 })
    goldPrice : number


    @Column({ type: "numeric", precision: 10, scale: 3, default: 0 })
    goldWeight : number


    @Column({ type: "numeric", precision: 10, scale: 0,default : 0 })
    totalPrice : number
    

    // @Column({nullable : true})
    // authority : string


    @Column({nullable : true})
    invoiceId : string


    @Column({nullable : true})
    status : string 

    @Column()
    date : string

    @Column()
    time : string
     
    @ManyToOne(()=>sellers , (seller) => seller.transActions)
    seller : sellers

    @Column({nullable:true,default:""})
    accounterId:string

    // @Column({nullable:true,default:null})
    // paymentMethod :  number           //0 : gateway   1 :transport   2 :inperson   3 : cash   4 : phisicalGold         

    @Column({  default: "", type: "varchar" })
    originCardPan: string

    // @Column({  default: "", type: "varchar" })
    // destCardPan: string
    
    // @Column({nullable:true,default:"",type:"varchar"})
    // description:string

    // @Column({nullable:true,default:"",type:"varchar"})
    // accounterDescription:string


    @CreateDateColumn()
    createdAt: Date
   
    @UpdateDateColumn()
    updatedAt : Date
           
    @DeleteDateColumn()
    deletedAt : Date

}