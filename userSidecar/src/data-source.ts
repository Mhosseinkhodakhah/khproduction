import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Otp } from "./entity/Otp"
import { Invoice } from "./entity/Invoice"
import { InvoiceType } from "./entity/InvoiceType"
import { Wallet } from "./entity/Wallet"
import { PaymentInfo } from "./entity/PaymentInfo"
import { BankAccount } from "./entity/BankAccount"
import { WalletTransaction } from "./entity/WalletTransaction"
import { goldPrice } from "./entity/goldPrice"
import { EstimateTransactions } from "./entity/EstimateTransactions"
import { config } from "dotenv"
import { transportInvoice } from "./entity/transport"
import { NotMatch } from "./entity/notMatch"
import { convertTradeInvoice } from "./entity/inpersonConvertTrade.entity"
import { productList } from "./entity/producList.entity"
import { handleGoldPrice } from "./entity/handleGoldPrice.entity"
import { oldUserQeue } from "./entity/oldUserQeue.entity"
import { systemSetting } from "./entity/systemSetting"

config()


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    password: process.env.DB_PASS,
    username: 'postgres',
    database: 'gold_home', // Database name
    synchronize: true,
    logging: false,
    entities: [User,Otp,Invoice,InvoiceType,NotMatch,Wallet,PaymentInfo , 
        oldUserQeue,BankAccount,WalletTransaction,goldPrice , handleGoldPrice ,
        systemSetting,EstimateTransactions , transportInvoice , convertTradeInvoice , productList],
    migrations: [],
    subscribers: [],})

