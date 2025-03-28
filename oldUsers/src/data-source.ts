import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { oldInvoice } from "./entity/oldInvoice"
import { InvoiceType } from "./entity/InvoiceType"
import { Wallet } from "./entity/wallet"
import { WalletTransaction } from "./entity/WalletTransaction"
import { Otp } from "./entity/Otp"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    password: 'qazZAQ!@#',
    username: 'postgres',
    database: "kh_old-user",
    synchronize: true,
    logging: false,
    entities: [User , oldInvoice , InvoiceType , Wallet , WalletTransaction,Otp],
    migrations: ['./migration/*.migration.ts'],
    subscribers: [],
})
