import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Order } from "./Order";
import { ProductItems } from "./ProductItem";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.items)
    order: Order;

    @ManyToOne(() => ProductItems)
    productItems: ProductItems;
    
    @Column()
    quantity: number;

    @Column({ type: "decimal" })
    price: number;
}
