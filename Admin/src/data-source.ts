import "reflect-metadata"
import { DataSource } from "typeorm"
import { Admin } from "./entity/Admin"
import { accessPoint } from "./entity/accessPoint"
import { cooperation } from "./entity/cooperation"
import { config } from "dotenv"

config()


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    password: 'Lucifer@#@#@#25255225',
    username: 'postgres',
    database: "kh_admin",
    synchronize: true,
    logging: false,
    entities: [Admin, accessPoint,cooperation],
    migrations: ['./migration/*.migration.ts'],
    subscribers: [],
})
