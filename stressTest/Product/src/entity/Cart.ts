import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from "typeorm";

import { CartItem } from "./CartItem";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() 
    userId:number

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
    items: CartItem[];
}
