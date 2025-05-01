import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class oldUserQeue{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    user: string

    @Column({ type: 'varchar' })
    oldGoldWeigth: string

    @CreateDateColumn()
    createdAt : Date

    @UpdateDateColumn()
    updatedAt : Date

    @DeleteDateColumn()
    deletedAt : Date

}