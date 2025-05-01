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
        method: "post",
        route: "/trade/permision",
        controller: adminController,
        action: "tradePermision",
        middlwares: [ adminMiddleware]
    },
    {
        method: "get",
        route: "/trade",
        controller: adminController,
        action: "getTradePermision",
        middlwares: [ adminMiddleware]
    }, {
        method: "get",
        route: "/token/check",
        controller: UserController,
        action: "checkToken",
        middlwares: [ authenticate]
    },
    {
        method: "post",
        route: "/logout",
        controller: UserController,
        action: "logOut",
        middlwares: []
    },
    {
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
    middlwares: [ authenticate]
},
{
    method: "get",
    route: "/ddellete/:phoneNumber",
    controller: UserController,
    action: "remove",
    middlwares: []
},
{
    method: "get",
    route: "/profile",
    controller: UserController,
    action: "profile",
    middlwares: [authenticate]

}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save",
    middlwares: [createNewUser ,authenticate]

}, {
    method: "post",
    route: "/otp",
    controller: OtpController,
    action: "sendOtpMessage",
    middlwares: [ratelimit]

}, {
    method: "post",
    route: "/verifyOtp",
    controller: OtpController,
    action: "checkOtpVerification",
    middlwares: []
},
{
    method: "post",
    route: "/identify",
    controller: ShahkarController,
    action: "identityInformationOfUser",
    middlwares: []
},
{
    method: "post",
    route: "/createTransaction",
    controller: InvoiceController,
    action: "createTransaction",
    middlwares: [authenticate]
},
{
    method: "post",
    route: "/completeBuy",
    controller: InvoiceController,
    action: "completeBuyTransaction",
    middlwares: [authenticate]

},
{
    method: "post",
    route: "/completeSell",
    controller: InvoiceController,
    action: "completeSellTransaction",
    middlwares: [authenticate]

},
{
    method: "post",
    route: "/verifyTransaction",
    controller: InvoiceController,
    action: "verifyTransaction",
    middlwares: [authenticate]
},
{
    method: "get",
    route: "/transactions/:type",
    controller: InvoiceController,
    action: "getTransactions",
    middlwares: [authenticate]

},
{
    method: "post",
    route: "/selltransactions",
    controller: InvoiceController,
    action: "getAllTransactionsSellType",
    middlwares: [authenticate,transactionStatusBody]

},
{
    method: "post",
    route: "/buytransactions",
    controller: InvoiceController,
    action: "getAllTransactionsBuyType",
    middlwares: [authenticate,transactionStatusBody]

},
{
    method: "post",
    route: "/specific-transaction/:id",
    controller: InvoiceController,
    action: "getTransactionById",
    middlwares: [authenticate]
},
{
    method: "get",
    route: "/wallet",
    controller: WalletController,
    action: "getWallet",
    middlwares: [authenticate]

},
{
    method: "post",
    route: "/addwallet",
    controller: WalletController,
    action: "updateWallet",
    middlwares: [authenticate]
    
},
{
    method: "post",
    route: "/clearOtpTable",
    controller: OtpController,
    action: "clearOtpTable",
    middlwares: []
},
{
    method: "post",
    route: "/createCart",
    controller: BankAccountController,
    action: "save",
    middlwares: [authenticate]
},
{
    method: "get",
    route: "/carts",
    controller: BankAccountController,
    action: "all",
    middlwares: [authenticate]
},{
    method: "post",
    route: "/carts/remove/:cartId",
    controller: BankAccountController,
    action: "deleteCard",
    middlwares: [authenticate]
},
{
    method: "get",
    route: "/carts/:id",
    controller: BankAccountController,
    action: "one",
    middlwares: [authenticate]
},
{
    method: "delete",
    route: "/carts/:id",
    controller: BankAccountController,
    action: "remove",
    middlwares: [authenticate]
},
{
    method: "get",
    route: "/goldPrice",
    controller: GoldPriceController,
    action: "getGoldPrice",
    middlwares: [authenticate]

},
{
    method: "post",
    route: "/deposit",
    controller: WalletController,
    action: "depositToWallet",
    middlwares: [authenticate]

},
{
    method: "post",
    route: "/verifyDeposit",
    controller: WalletController,
    action: "verifyDeposit",
    middlwares: [authenticate]

},
{
    method: "post",
    route: "/withdraw",
    controller: WalletController,
    action: "withdrawFromWallet",
    middlwares: [authenticate]

},{
    method: "post",
    route: "/transPort",
    controller: WalletController,
    action: "transport",
    middlwares: [authenticate]

},{
    method: "post",
    route: "/transPort/confirm",
    controller: WalletController,
    action: "confirmTransport",
    middlwares: [authenticate]

},
{
    method: "post",
    route: "/walletTransactions",
    controller: WalletController,
    action: "getWalletTransactions",
    middlwares: [authenticate]
},
{
    method: "get",
    route: "/types",
    controller: InvoiceTypeController,
    action: "all",
    middlwares: [authenticate]

},
{
    method: "get",
    route: "/types/:id",
    controller: InvoiceTypeController,
    action: "one",
    middlwares: [authenticate]

},
{
    method: "post",
    route: "/types",
    controller: InvoiceTypeController,
    action: "save",
    middlwares: [authenticate]

},
{
    method: "delete",
    route: "/types",
    controller: InvoiceTypeController,
    action: "remove",
    middlwares: [authenticate]
},{
    method: "get",
    route: "/dashboard",
    controller: UserController,
    action: "charts",
    middlwares: [authenticate]
},

/**
 * this route is for logger to check the service status
 * status checker
 */
{
    method: "get",
    route: "/monitor/all",
    controller: interServiceController,
    action: "getStatus",                     // get status by logger service
    middlwares: []
}, {
    method: "patch",
    route: "/interservice/create",
    controller: interServiceController,
    action: "addNewUser",                   // add new user by oldUser service
    middlwares: []
}, {
    method: "post",
    route: "/interservice/updateWaller/:phoneNumber",
    controller: interServiceController,
    action: "updateWallet",                   // add new user by oldUser service
    middlwares: []
},{
    method: "post",
    route: "/interservice/Wallet/update/:id",
    controller: interServiceController,
    action: "decreaseForBranch",                   // add new user by oldUser service
    middlwares: []
},
{                          
    method: "put",
    route: "/admin/transAction/:authority",
    controller: adminController,
    action: "checkStatus",        /**its for verifying the deposit by admin */
    middlwares: [adminMiddleware , verifyTransActinon]
},
{
    method: "get",
    route: "/call/user",
    controller: PhoneInvoiceController,
    action: "getAllPhoneTransactionForUser",
    middlwares: [authenticate]
},
{
    method: "get",
    route: "/callsell/user",
    controller: PhoneInvoiceController,
    action: "getAllSellPhoneTransactionForUser",
    middlwares: [authenticate]
},

/**
 * this route is just for test
 */
,{
    method: "get",
    route: "/test/:phone",
    controller: InvoiceTypeController,
    action: "test",
    middlwares: []
},

]

