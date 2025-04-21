import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class branche {

    @PrimaryGeneratedColumn()
    id : number

    @Column()


}
