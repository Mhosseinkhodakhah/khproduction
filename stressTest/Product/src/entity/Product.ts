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
import { Category } from "./Category"; // Adjust path as needed
import { ProductItems } from "./ProductItem";


@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    wage : number ;
    
    @Column()
    createdBy : string ;

    @Column({default:""})
    updatedBy : string  ;

    @Column()
    brand : string ;

    @Column()
    mainPhoto : string ;

    @Column("varchar", { array: true })
    photos: string[];

    @Column({default:true})
    isExist : boolean

    @Column("varchar", { array: true })
    features: string[]

    @OneToMany((type)=>ProductItems,(ProductItems)=>ProductItems.product, { cascade: true })
    @JoinColumn()
    items : ProductItems[]

    @ManyToOne(() => Category, (category) => category.products) 
    @JoinColumn({ name: "categoryId" }) 
    category: Category;

    @Column()
    categoryId: number; 

    @CreateDateColumn()
    createdAt : Date
    
    @UpdateDateColumn()
    updatedAt : Date
    
    @DeleteDateColumn()
    deletedAt : Date

}

