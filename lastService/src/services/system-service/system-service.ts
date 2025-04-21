import { title } from "process";
import { AppDataSource } from "../../data-source";
import { InvoiceType } from "../../entity/InvoiceType";
import { User } from "../../entity/User";
import { Wallet } from "../../entity/Wallet";
import { Invoice } from "../../entity/Invoice";
import { WalletTransaction } from "../../entity/WalletTransaction";
import { PaymentInfo } from "../../entity/PaymentInfo";
import { handleGoldPrice } from "../../entity/handleGoldPrice.entity";


export class SystemService {
    private userRepository = AppDataSource.getRepository(User);
    private walletRepository = AppDataSource.getRepository(Wallet);
    private typesRepository = AppDataSource.getRepository(InvoiceType)
    private invoiceRepository = AppDataSource.getRepository(Invoice)
    private handleGoldPrice = AppDataSource.getRepository(handleGoldPrice)
    private piRepo = AppDataSource.getRepository(PaymentInfo)
    private walletTransactionsRepository = AppDataSource.getRepository(WalletTransaction)

    async initializeSystemUser() {
        const systemUser = await this.userRepository.findOneBy({ isSystemUser: true });

        if (systemUser) {
            console.log("System user already exists. Skipping initialization.");
            return;
        }
        
        const newSystemUser = this.userRepository.create({
            firstName: "System User",
            lastName: "System User",
            email: "system@example.com",
            phoneNumber: "09191919191",
            isSystemUser: true,
        });
        await this.userRepository.save(newSystemUser);

        const systemWallet = this.walletRepository.create({
            balance: 0,
            goldWeight: 10000,
            user: newSystemUser,
        });
        await this.walletRepository.save(systemWallet);

        console.log("System user and wallet initialized successfully.");
    }

    async initializeTransactionTypes(){
        try {
            const sellType = await this.typesRepository.findOne({where : {title : "sell" }});
            const buyType = await this.typesRepository.findOne({where : {title : "buy" }});
            if (sellType && buyType) {
                console.log("types already exists. Skipping initialization.");
                return;
            }
            let sellTypeToSave = await this.typesRepository.create({ 
                 persianTitle : "فروش",title : "sell"
            })
            let buyTypeToSave = await this.typesRepository.create({ 
                persianTitle : "خرید",title : "buy"
           })
           await this.typesRepository.save([sellTypeToSave , buyTypeToSave])
        } catch (error) {
            console.log("error in iniialize types", error );
        }

    }
    async refreshDb(){
        await this.walletTransactionsRepository.delete({})
        await this.invoiceRepository.delete({})
        await this.piRepo.delete({})
        await this.userRepository.delete({})
    }


    async createHanldeGoldPrice(){
        let all = await this.handleGoldPrice.find()
        if (!all || all.length == 0) {
            let creations = this.handleGoldPrice.create({
                price : 0
            })
            await this.handleGoldPrice.save(creations)
            return 'handle Gold Price Created'
        }
        return 'handle goldPrice existance'
    }
}