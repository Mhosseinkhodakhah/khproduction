import "reflect-metadata"
import { DataSource } from "typeorm"
import { config } from "dotenv";
import { sellers } from "./entity/sellers";
import { branche } from "./entity/branche";
import { transAction } from "./entity/transAction.entity";

config();

export const AppDataSource = new DataSource({
    type: 'postgres', // Database type
    host: process.env.DB_HOST, // 'localhost', // Database host
    port: 5432, // Default PostgreSQL port
    username: process.env.DB_USER ,// 'postgres', // PostgreSQL username
    password:  process.env.DB_PASS ,// '123123', // PostgreSQL password
    database: 'branches', // Database name
    synchronize: true,
    logging: false,
    entities: [sellers , branche , transAction],
    migrations: [],
    subscribers: [],
})
