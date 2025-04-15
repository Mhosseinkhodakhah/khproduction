import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm";
import { Product } from "./Product"; // Adjust path as needed

@Entity()
export class ProductItems {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    size: string;

    @Column({type : 'float'})
    wight: number;

    @Column()
    count : number ;
    
    @ManyToOne(() => Product, (product) => product.items) 
    @JoinColumn({ name: "productId" }) 
    product: Product;

    @Column({nullable : true})
    productId: number; 

    @CreateDateColumn()
    createdAt : Date
    
    @UpdateDateColumn()
    updatedAt : Date
    
    @DeleteDateColumn()
    deletedAt : Date

}

