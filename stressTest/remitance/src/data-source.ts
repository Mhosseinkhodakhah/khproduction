import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Remmitance } from "./entity/Remmitance"
import { Wallet } from "./entity/wallet"
import { WalletTransaction } from "./entity/WalletTransaction"
import {config} from "dotenv"



config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    password: process.env.DB_PASS,
    username: 'postgres',
    database: "kh_remmitance",
    synchronize: true,
    logging: false,
    entities: [User ,Remmitance , Wallet , WalletTransaction],
    migrations: ['./migration/*.migration.ts'],
    subscribers: [],
})
