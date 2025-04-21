import { Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class sellers {

    @PrimaryGeneratedColumn()
    id: number

}
