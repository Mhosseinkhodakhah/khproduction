import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { installments } from "./entity/installments"
import { config } from "dotenv"


config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    password: process.env.DB_PASS,
    username: 'postgres',
    database: "kh_installment",
    synchronize: true,
    logging: false,
    entities: [User , installments],
    migrations: ['./migration/*.migration.ts'],
    subscribers: [],
})
