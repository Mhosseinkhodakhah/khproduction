import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { oldInvoice } from "./oldInvoice"

@Entity()
export class InvoiceType {
   
    @PrimaryGeneratedColumn()
    id : number
    
    @Column()
    title : string
    
    @Column()
    persianTitle : string

    @OneToMany(()=> oldInvoice ,(invoice) => invoice.type)
    invoices : oldInvoice[]
}