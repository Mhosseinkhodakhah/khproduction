import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Otp } from "./entity/Otp"
import { Invoice } from "./entity/Invoice"
import { InvoiceType } from "./entity/InvoiceType"
import {Wallet} from "./entity/Wallet"
import { config } from "dotenv";
import { PaymentInfo } from "./entity/PaymentInfo"
import { BankAccount } from "./entity/BankAccount"
import { WalletTransaction } from "./entity/WalletTransaction"
import { goldPrice } from "./entity/goldPrice"
import { EstimateTransactions } from "./entity/EstimateTransactions"
import { transportInvoice } from "./entity/transport"
import { productList } from "./entity/producList.entity"
import { convertTradeInvoice } from "./entity/inpersonConvertTrade.entity"
import { NotMatch } from "./entity/notMatch"
import { handleGoldPrice } from "./entity/handleGoldPrice.entity"
import { systemSetting } from "./entity/systemSetting"

config();

export const AppDataSource = new DataSource({
    type: 'postgres', // Database type
    host: process.env.DB_HOST, // 'localhost', // Database host
    port: 5432, // Default PostgreSQL port
    username: process.env.DB_USER ,// 'postgres', // PostgreSQL username
    password:  process.env.DB_PASS ,// '123123', // PostgreSQL password
    database: 'gold_home', // Database name
    synchronize: true,
    logging: false,
    entities: [User,Otp,Invoice,InvoiceType,Wallet,PaymentInfo,systemSetting,NotMatch,BankAccount,WalletTransaction,goldPrice , handleGoldPrice,EstimateTransactions , transportInvoice , productList , convertTradeInvoice],
    migrations: [],
    subscribers: [],
})
