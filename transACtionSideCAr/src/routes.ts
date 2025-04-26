import { OtpController } from "./controller/OtpController"
import { ShahkarController } from "./controller/ShahkarController"
import { UserController } from "./controller/UserController"
import { InvoiceController } from "./controller/InvoiceController";
import { WalletController } from "./controller/WalletController";
import { authenticate } from "./middlware/authenticate";
import { BankAccountController } from "./controller/BankAccountController";
import { GoldPriceController } from "./controller/GoldPriceController";
import { InvoiceTypeController } from "./controller/InvoiceTypeController";
import {PhoneInvoiceController} from "./controller/phoneInvoce.controller"
import {transactionStatusBody} from "./DTO/onlineInvoice.dto"
import ratelimit from "./middlware/ratelimit";
import statusBar from "./middlware/statusBar";
import interServiceController from "./controller/interservice.controller";
import adminController from "./controller/admin.controller";
import { adminMiddleware } from "./middlware/auth";
import { approveWithdrawalDTO, changeInpersonStatus, createBuyTransAction, creatSellTransAction, getOtp, verifyIdentityInperson, verifyOtp, verifyTransActinon } from "./DTO/admin.dto";
import {createBuyPhone,createSellPhone,approveBuyPhone,rejectBuyPhone,updatePhoneInvoice} from "./DTO/phoneInvoice.dto"
import inPersonController from "./controller/inPerson.controller";
import { createNewUser } from "./DTO/applicationDTo";
import invoiceConvertorController from "./controller/inpersonConvert.controller";


export const Routes = [
{
    method: "get",
    route: "/test/:phone",
    controller: InvoiceTypeController,
    action: "test",
    middlwares: []
},

]

