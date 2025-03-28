import "reflect-metadata"
import { DataSource } from "typeorm"
import {OldUser} from "./entity/OldUser"
import {config} from "dotenv"

config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port:  +process.env.DB_PORT || 5432,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "12345678",
    database: process.env.DB_NAME || "kh_product",
    synchronize: true,
    logging: false,
    entities: [OldUser],
    migrations: [],
    subscribers: [],
})
    