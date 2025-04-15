
import {
    Entity,
    Tree,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    TreeChildren,
    TreeParent,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm"
import { Product } from "./Product"

@Entity()
@Tree("closure-table")
export class Category {
    @PrimaryGeneratedColumn()
    id: number 

    @Column()
    name: string

    @Column()
    description: string

    @TreeChildren()
    children: Category[]

    @TreeParent()
    parent: Category

    @OneToMany((type)=>Product,(Product)=>Product.category)
    products : Product[]

    @CreateDateColumn()
    createdAt : Date

    @UpdateDateColumn()
    updatedAt : Date

    @DeleteDateColumn()
    deletedAt : Date

}