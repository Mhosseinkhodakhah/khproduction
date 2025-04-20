import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { BankAccount } from "../entity/BankAccount";
import { User } from "../entity/User";
import { ShahkarController } from "./ShahkarController";
import { SmsService } from "../services/sms-service/message-service";
import logger from "../services/interservice/logg.service";
import monitor from "../util/statusMonitor";



export class BankAccountController {

    private bankAccountRepository = AppDataSource.getRepository(BankAccount);
    private userRepository = AppDataSource.getRepository(User);
    private shahkarController = new ShahkarController()
    private smsService = new SmsService()
    private checkCard = new logger()

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            let userId = request['user_id']
            const bankAccounts = await this.bankAccountRepository.find({where :{owner :{ id : userId}}, relations: ["owner"] });
            monitor.addStatus({
                scope : 'bank account controller',
                status : 1,
                error: null
            })
            return response.status(200).json(bankAccounts);
        } catch (error) {
            monitor.addStatus({
                scope : 'bank account controller',
                status : 0,
                error: `${error}`
            })

            console.log("Error in finding all bank accounts", error);
            return response.status(500).json({msg : "خطای داخلی سیستم"})
        }
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        if (isNaN(id)) {
            monitor.addStatus({
                scope : 'bank account controller',
                status : 0,
                error: `invalid bank account id`
            })
            return response.status(400).json({ error: "Invalid bank account ID" }); 
        }

        try {
            const bankAccount = await this.bankAccountRepository.findOne({
                where: { id },
                relations: ["owner"]
            });

            if (!bankAccount) {
                monitor.addStatus({
                    scope : 'bank account controller',
                    status : 0,
                    error: `حساب بانکی یافت نشد`
                })
                return response.status(400).json({ error: "Bank account not found" });
            }
            monitor.addStatus({
                scope : 'bank account controller',
                status : 1,
                error: null
            })
            return response.status(200).json(bankAccount);
        } catch (error) {
            monitor.addStatus({
                scope : 'bank account controller',
                status : 0,
                error: `${error}`
            })
            console.log("Error in finding bank account by id", error);
            return response.status(500).json({msg : "خطای داخلی سیستم"})
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { cardNumber } = request.body;
        let ownerId = request.user_id
        console.log(ownerId)
        if ( !cardNumber || !ownerId) {
            monitor.addStatus({
                scope : 'bank account controller',
                status : 0,
                error: `وارد کردن شماره کارت الزامی`
            })
            return response.status(400).json({ msg: "فیلد شماره کارت نمیتواند خالی باشد" });
        }

        try {
            const owner = await this.userRepository.findOneBy({ id: ownerId });
            console.log(owner)
            if (!owner) {
                monitor.addStatus({
                    scope : 'bank account controller',
                    status : 0,
                    error: `مالک شماره کارت یافت نشد`
                })
                return response.status(400).json({ error: "Owner not found" });
            }
            const bankAccount = this.bankAccountRepository.create({
                cardNumber,
                owner,
                isVerified: false
            });
            let info = {cardNumber : bankAccount.cardNumber , 
                nationalCode : owner.nationalCode,
                birthDate : owner.birthDate
                }
                console.log(info)
                let isMatch = await this.checkCard.checkCardNuber(info)
                // let isMatch = await this.shahkarController.checkMatchPhoneNumberAndCartNumber(info)
                console.log('its returned data>>>' , isMatch)
                if (isMatch == 500){
                    return response.status(500).json({msg : 'سیستم ثبت کارت بانکی موقتا در دسترس نمیباشد.لطفا دقایقی دیگر مجددا تلاش کنید'})
                }
                // if (typeof(isMatch) === undefined){
                //     return response.status(500).json({msg : 'سیستم ثبت کارت بانکی موقتا در دسترس نمیباشد.لطفا دقایقی دیگر مجددا تلاش کنید'})
                // }
                if (isMatch == false){
                    monitor.addStatus({
                        scope : 'bank account controller',
                        status : 0,
                        error: `کارت نامعتبر `
                    })
                    return response.status(400).json({ msg: "کارت نامعتبر است" });
                }
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
                    monitor.addStatus({
                        scope : 'bank account controller',
                        status : 1,
                        error: null
                    })
                    return response.status(200).json({bank: createBankAccount , msg : "کارت با موفقیت ایجاد شد"});
                }
                monitor.addStatus({
                    scope : 'bank account controller',
                    status : 0,
                    error: `کارت نامعتبر `
                })
                return response.status(400).json({ msg: "کارت نامعتبر است" });
            } catch (error) {
                monitor.addStatus({
                    scope : 'bank account controller',
                    status : 0,
                    error: `${error}`
                })
                console.log("Error in creating bank account", error);
                return response.status(500).json({msg : "خطا در ثبت کارت بانکی"})
            }
        }

        async deleteCard(request: Request, response: Response, next: NextFunction){
            try {
                let cardId = request.params.id;
                let card = await this.bankAccountRepository.findOne({where : {id : +cardId}})
                if (!card){
                    return response.status(400).json({
                        msg : 'کارت بانکی مورد نظر یافت نشد.'
                    })
                }
                await this.bankAccountRepository.remove(card)
                return response.status(200).json({
                    msg : 'کارت بانکی مورد نظر حذف شد.'
                })
            } catch (error) {
                return response.status(200).json({
                    msg : 'کارت مورد نظر حذف نشد.لطفا دقایقی دیگر مجددا تلاش کنید'
                })                            
            }
        }

    async verify(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        if (isNaN(id)) {
            monitor.addStatus({
                scope : 'bank account controller',
                status : 0,
                error: `Invalid bank account ID`
            })
            return response.status(400).json({ msg: "Invalid bank account ID" });
        }

        try {
            const bankAccount = await this.bankAccountRepository.findOne({where :{ id} , relations : ['owner'] });
            if (!bankAccount) {
                monitor.addStatus({
                    scope : 'bank account controller',
                    status : 0,
                    error: `کارت بانکی یافت نشد`
                })
                return response.status(400).json({ msg: "کارت بانکی یافت نشد" });
            }
            let info = {cardNumber : bankAccount.cardNumber , 
            nationalCode : bankAccount.owner.nationalCode , 
            birthDate : bankAccount.owner.birthDate
            }
            let isMatch = await  this.shahkarController.checkMatchPhoneNumberAndCartNumber(info)
            if (isMatch != null && isMatch != undefined) {
                bankAccount.isVerified = isMatch;
                const updatedBankAccount = await this.bankAccountRepository.save(bankAccount);
                monitor.addStatus({
                    scope : 'bank account controller',
                    status : 1,
                    error: null
                })
                return response.status(200).json(updatedBankAccount);                
            }else{
                monitor.addStatus({
                    scope : 'bank account controller',
                    status : 0,
                    error: `خطا در اعتبار سنجی کارت بانکی`
                })
                return response.status(500).json({ msg: "خطا در اعتبارسنجی کارت بانکی" });
            }
        } catch (error) {
            console.log("Error in verifying bank account", error);
            monitor.addStatus({
                scope : 'bank account controller',
                status : 0,
                error: `${error}`
            })
            return response.status(500).json({msg : "خطا در اعتبارسنجی کارت بانکی"})
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        if (isNaN(id)) {
            monitor.addStatus({
                scope : 'bank account controller',
                status : 0,
                error: `Invalid bank account ID`
            })
            return response.status(400).json({ msg: "Invalid bank account ID" });
        }

        try {
            const bankAccountToRemove = await this.bankAccountRepository.findOneBy({ id });

            if (!bankAccountToRemove) {
                monitor.addStatus({
                    scope : 'bank account controller',
                    status : 0,
                    error: `کارت بانکی یافت نشد`
                })
                return response.status(404).json({ msg: "کارت بانکی یافت نشد" });
            }

            await this.bankAccountRepository.remove(bankAccountToRemove);
            monitor.addStatus({
                scope : 'bank account controller',
                status : 1,
                error: null
            })
            return response.status(200).json({ msg: "کارت بانکی با موفقیت حذف شد" });
        } catch (error) {
            console.log("Error in deleting bank account", error);
            monitor.addStatus({
                scope : 'bank account controller',
                status : 0,
                error: `${error}`
            })
            return response.status(500).json({msg :"خطا در حذف کارت بانکی"})
        }
    }
}