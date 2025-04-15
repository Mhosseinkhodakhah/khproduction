import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Cart } from "./Cart";
import { ProductItems } from "./ProductItem";

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cart, (cart) => cart.items)
    cart: Cart;

    @ManyToOne(() => ProductItems)
    productItem:ProductItems ;

    @Column()
    quantity: number;
}
