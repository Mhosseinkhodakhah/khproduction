import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { BankAccount } from "../entity/BankAccount";
import { User } from "../entity/User";
import { ShahkarController } from "./ShahkarController";
import { SmsService } from "../services/sms-service/message-service";

export class BankAccountController {

    private bankAccountRepository = AppDataSource.getRepository(BankAccount);
    private userRepository = AppDataSource.getRepository(User);
    private shahkarController = new ShahkarController()
    private smsService = new SmsService()
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            let userId = request['user_id']
            const bankAccounts = await this.bankAccountRepository.find({where :{owner :{ id : userId}}, relations: ["owner"] });
            response.status(200).json(bankAccounts);
        } catch (error) {
            console.log("Error in finding all bank accounts", error);
            return response.status(500).json({msg : "خطای داخلی سیستم"})
        }
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        if (isNaN(id)) {
            return response.status(400).json({ error: "Invalid bank account ID" }); 
        }

        try {
            const bankAccount = await this.bankAccountRepository.findOne({
                where: { id },
                relations: ["owner"]
            });

            if (!bankAccount) {
                return response.status(404).json({ error: "Bank account not found" });
            }

            response.status(200).json(bankAccount);
        } catch (error) {
            console.log("Error in finding bank account by id", error);
            return response.status(500).json({msg : "خطای داخلی سیستم"})
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { cardNumber } = request.body;
        let ownerId = request.user_id
        console.log(ownerId)
        if ( !cardNumber || !ownerId) {
            return response.status(400).json({ msg: "فیلد شماره کارت نمیتواند خالی باشد" });
        }

        try {
            const owner = await this.userRepository.findOneBy({ id: ownerId });
            console.log(owner)
            if (!owner) {
                return response.status(404).json({ error: "Owner not found" });
            }
            const bankAccount = this.bankAccountRepository.create({
                cardNumber, 
                owner,
                isVerified: false
            });
            let info = {cardNumber : bankAccount.cardNumber , 
                nationalCode : owner.nationalCode , 
                birthDate : owner.birthDate
                }
                console.log(info)
                let isMatch = await this.shahkarController.checkMatchPhoneNumberAndCartNumber(info)
                bankAccount.isVerified = isMatch;
                
                if (isMatch) {

                    let res =  await this.shahkarController.convertCardToSheba(cardNumber)
                    if (res) {
                        bankAccount.shebaNumber = res.ibanInfo.iban
                        bankAccount.name = res.ibanInfo.bank
                    }
                    console.log(res)
                    owner.isHaveBank = true;
                    await this.userRepository.save(owner)
                    const createBankAccount = await this.bankAccountRepository.save(bankAccount);
                    await this.smsService.sendGeneralMessage(owner.phoneNumber,"verifyCart" , bankAccount.cardNumber,null,null)

                    return response.status(200).json({bank: createBankAccount , msg : "کارت با موفقیت ایجاد شد"});                
                    
                }
                response.status(500).json({ msg: "کارت نامعتبر است" });
            } catch (error) {
                console.log("Error in creating bank account", error);
                return response.status(500).json({msg : "خطا در ثبت کارت بانکی"})
            }
        }

    async verify(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        if (isNaN(id)) {
            return response.status(400).json({ msg: "Invalid bank account ID" });
        }

        try {
            const bankAccount = await this.bankAccountRepository.findOne({where :{ id} , relations : ['owner'] });
            if (!bankAccount) {
                return response.status(404).json({ msg: "کارت بانکی یافت نشد" });
            }
            let info = {cardNumber : bankAccount.cardNumber , 
            nationalCode : bankAccount.owner.nationalCode , 
            birthDate : bankAccount.owner.birthDate
            }
            let isMatch = await  this.shahkarController.checkMatchPhoneNumberAndCartNumber(info)
            if (isMatch != null && isMatch != undefined) {
                bankAccount.isVerified = isMatch;
                const updatedBankAccount = await this.bankAccountRepository.save(bankAccount);
                response.status(200).json(updatedBankAccount);                
            }else{
                response.status(500).json({ msg: "خطا در اعتبارسنجی کارت بانکی" });
            }
        } catch (error) {
            console.log("Error in verifying bank account", error);
            return response.status(500).json({msg : "خطا در اعتبارسنجی کارت بانکی"})
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        if (isNaN(id)) {
            return response.status(400).json({ msg: "Invalid bank account ID" });
        }

        try {
            const bankAccountToRemove = await this.bankAccountRepository.findOneBy({ id });

            if (!bankAccountToRemove) {
                return response.status(404).json({ msg: "کارت بانکی یافت نشد" });
            }

            await this.bankAccountRepository.remove(bankAccountToRemove);
            response.status(200).json({ msg: "کارت بانکی با موفقیت حذف شد" });
        } catch (error) {
            console.log("Error in deleting bank account", error);
            return response.status(500).json({msg :"خطا در حذف کارت بانکی"})
        }
    }

}