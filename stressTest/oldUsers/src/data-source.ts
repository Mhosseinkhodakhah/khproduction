import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { oldInvoice } from "./entity/oldInvoice"
import { InvoiceType } from "./entity/InvoiceType"
import { Wallet } from "./entity/wallet"
import { WalletTransaction } from "./entity/WalletTransaction"
import { Otp } from "./entity/Otp"
import { config } from "dotenv"



config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    password: process.env.DB_PASS,
    username: 'postgres',
    database: "kh_old-user2",
    synchronize: true,
    logging: false,
    entities: [User , oldInvoice , InvoiceType , Wallet , WalletTransaction,Otp],
    migrations: ['./migration/*.migration.ts'],
    subscribers: [],
})
