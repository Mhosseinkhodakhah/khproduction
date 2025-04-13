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
import { RemittanceController } from "./controller/RemittanceController";


export const Routes = [

    // {
    //     method: "post",
    //     route: "/trade/permision",
    //     controller: adminController,
    //     action: "tradePermision",
    //     middlwares: [ adminMiddleware]
    // },
    // {
    //     method: "get",
    //     route: "/trade",
    //     controller: adminController,
    //     action: "getTradePermision",
    //     middlwares: [ adminMiddleware]
    // },
//      {
//         method: "get",
//         route: "/token/check",
//         controller: UserController,
//         action: "checkToken",
//         middlwares: [ authenticate]
//     },
//     {
//     method: "get",
//     route: "/users",
//     controller: UserController,
//     action: "all",
//     middlwares: [ authenticate]
// },
// {
//     method: "get",
//     route: "/profile",
//     controller: UserController,
//     action: "profile",
//     middlwares: [authenticate]

// }, {
//     method: "post",
//     route: "/users",
//     controller: UserController,
//     action: "save",
//     middlwares: [createNewUser ,authenticate]

// }, {
//     method: "delete",
//     route: "/users/:id",
//     controller: UserController,
//     action: "remove",
//     middlwares: [authenticate]

// }, 
{
    method: "post",
    route: "/otp",
    controller: OtpController,
    action: "sendOtpMessage",
    middlwares: [ratelimit]

},
// ,{
//     method: "post",
//     route: "/verifyOtp",
//     controller: OtpController,
//     action: "checkOtpVerification",
//     middlwares: []
// },
// {
//     method: "post",
//     route: "/identify",
//     controller: ShahkarController,
//     action: "identityInformationOfUser",
//     middlwares: []
// },
// {
//     method: "post",
//     route: "/createTransaction",
//     controller: InvoiceController,
//     action: "createTransaction",
//     middlwares: [authenticate]
// },
// {
//     method: "post",
//     route: "/completeBuy",
//     controller: InvoiceController,
//     action: "completeBuyTransaction",
//     middlwares: [authenticate]

// },
// {
//     method: "post",
//     route: "/completeSell",
//     controller: InvoiceController,
//     action: "completeSellTransaction",
//     middlwares: [authenticate]

// },
// {
//     method: "post",
//     route: "/verifyTransaction",
//     controller: InvoiceController,
//     action: "verifyTransaction",
//     middlwares: [authenticate]
// },
// {
//     method: "get",
//     route: "/transactions/:type",
//     controller: InvoiceController,
//     action: "getTransactions",
//     middlwares: [authenticate]

// },
// {
//     method: "post",
//     route: "/selltransactions",
//     controller: InvoiceController,
//     action: "getAllTransactionsSellType",
//     middlwares: [authenticate,transactionStatusBody]

// },
// {
//     method: "post",
//     route: "/buytransactions",
//     controller: InvoiceController,
//     action: "getAllTransactionsBuyType",
//     middlwares: [authenticate,transactionStatusBody]

// },
// {
//     method: "post",
//     route: "/specific-transaction/:id",
//     controller: InvoiceController,
//     action: "getTransactionById",
//     middlwares: [authenticate]
// },
// {
//     method: "get",
//     route: "/wallet",
//     controller: WalletController,
//     action: "getWallet",
//     middlwares: [authenticate]

// },
// {
//     method: "post",
//     route: "/addwallet",
//     controller: WalletController,
//     action: "updateWallet",
//     middlwares: [authenticate]
    
// },
// {
//     method: "post",
//     route: "/clearOtpTable",
//     controller: OtpController,
//     action: "clearOtpTable",
//     middlwares: []
// },
// {
//     method: "post",
//     route: "/createCart",
//     controller: BankAccountController,
//     action: "save",
//     middlwares: [authenticate]
// },
// {
//     method: "get",
//     route: "/carts",
//     controller: BankAccountController,
//     action: "all",
//     middlwares: [authenticate]
// },
// {
//     method: "get",
//     route: "/carts/:id",
//     controller: BankAccountController,
//     action: "one",
//     middlwares: [authenticate]
// },
// {
//     method: "delete",
//     route: "/carts/:id",
//     controller: BankAccountController,
//     action: "remove",
//     middlwares: [authenticate]
// },
// {
//     method: "get",
//     route: "/goldPrice",
//     controller: GoldPriceController,
//     action: "getGoldPrice",
//     middlwares: [authenticate]

// },
// {
//     method: "get",
//     route: "/goldPrice/:date",
//     controller: GoldPriceController,
//     action: "getGoldPriceForDate",
//     middlwares: [adminMiddleware]
// },
// {
//     method: "post",
//     route: "/deposit",
//     controller: WalletController,
//     action: "depositToWallet",
//     middlwares: [authenticate]

// },
// {
//     method: "post",
//     route: "/verifyDeposit",
//     controller: WalletController,
//     action: "verifyDeposit",
//     middlwares: [authenticate]

// },
// {
//     method: "post",
//     route: "/withdraw",
//     controller: WalletController,
//     action: "withdrawFromWallet",
//     middlwares: [authenticate]

// },{
//     method: "post",
//     route: "/transPort",
//     controller: WalletController,
//     action: "transport",
//     middlwares: [authenticate]

// },{
//     method: "post",
//     route: "/transPort/confirm",
//     controller: WalletController,
//     action: "confirmTransport",
//     middlwares: [authenticate]

// },
// {
//     method: "post",
//     route: "/walletTransactions",
//     controller: WalletController,
//     action: "getWalletTransactions",
//     middlwares: [authenticate]
// },

// {   
//     method: "post",
//     route: "/completeWithdraw",
//     controller: WalletController,
//     action: "completeWithdraw",
//     middlwares : [authenticate]
// },
// {
//     method: "get",
//     route: "/types",
//     controller: InvoiceTypeController,
//     action: "all",
//     middlwares: [authenticate]

// },
// {
//     method: "get",
//     route: "/types/:id",
//     controller: InvoiceTypeController,
//     action: "one",
//     middlwares: [authenticate]

// },
// {
//     method: "post",
//     route: "/types",
//     controller: InvoiceTypeController,
//     action: "save",
//     middlwares: [authenticate]

// },
// {
//     method: "delete",
//     route: "/types",
//     controller: InvoiceTypeController,
//     action: "remove",
//     middlwares: [authenticate]
// },{
//     method: "get",
//     route: "/dashboard",
//     controller: UserController,
//     action: "charts",
//     middlwares: [authenticate]
// },

/**
 * this routes is for inperson buy and sell 
 */
{
    method: "post",
    route: "/inperson/otp",                   /**its for geting otp in inperson purchase */
    controller: inPersonController,
    action: "otp",
    middlwares: [adminMiddleware , getOtp]
},{
    method: "post",
    route: "/inperson/otp/verify",           /**its for verify the otp cod in inperson purchase  */
    controller: inPersonController,
    action: "verifyOtp",
    middlwares: [adminMiddleware,verifyOtp]
},{
    method: "post",
    route: "/inperson/buy/create",
    controller: inPersonController,
    action: "creatBuyTransActions",             /**its for creating buy transACtion in inperson purchase */
    middlwares: [adminMiddleware,createBuyTransAction]
},{
    method: "post",
    route: "/inperson/sell/create",
    controller: inPersonController,
    action: "creatSellTransActions",         /**its for creating sell transAction in inperson purchase */
    middlwares: [adminMiddleware,creatSellTransAction]
},
// {
//     method: "get",
//     route: "/inperson/sell/all/:status",
//     controller: inPersonController,
//     action: "getAllSellPending",         /**its for get all pending inperson purchase */
//     middlwares: [adminMiddleware]
// },
// {
//     method: "get",
//     route: "/inperson/buy/all/:status",
//     controller: inPersonController,
//     action: "getAllBuyPending",         /**its for get all pending inperson purchase */
//     middlwares: [adminMiddleware]
// },
{
    method: "post",
    route: "/inperson/transaction/changestatus",
    controller: inPersonController,
    action: "changeTransActionsStatusByAccountant",         /**its for get all pending inperson purchase */
    middlwares: [adminMiddleware ,changeInpersonStatus]
},{
    method: "post",
    route: "/inperson/user/identity",
    controller: inPersonController,
    action: "identityInformationOfUser",         /**its for verifying the oldUsers user */
    middlwares: [adminMiddleware, verifyIdentityInperson]
},


/**
 * these routes is for admin pannel . . .
 */
// {
//     method: "get",
//     route: "/admin/users/all",
//     controller: adminController,
//     action: "getAllUsers",              /**its for get all users by admin */
//     middlwares: [adminMiddleware]
// }, 
// {
//     method: "get",
//     route: "/admin/wallet/all",
//     controller: adminController,
//     action: "getAllWallet",             /**its for get all wallet by admin */
//     middlwares: [adminMiddleware]
// }, {
//     method: "get",
//     route: "/admin/transactions/all",
//     controller: adminController,
//     action: "getAllTransActions",        /**its for get all transActions by admin */
//     middlwares: [adminMiddleware]
// }, 
{                                  
    method: "put",
    route: "/admin/transactions/:transactionId",
    controller: adminController,
    action: "handledVerify",            //**its for verifying the transaction by admin */
    middlwares: [adminMiddleware , verifyTransActinon]
}, 
// {                         
//     method: "get",
//     route: "/admin/deposit/pending",
//     controller: adminController,
//     action: "getAllPendingsDeposit",       /**its for getting all pendings deposit with admin */
//     middlwares: [adminMiddleware]
// },
// {                         
//     method: "get",
//     route: "/admin/deposit/succeed",
//     controller: adminController,
//     action: "getAllSucceedDeposit",       /**its for getting all succeed deposit with admin */
//     middlwares: [adminMiddleware]
// },
{                          
    method: "put",
    route: "/admin/deposit/:depositId",
    controller: adminController,
    action: "handleVerifyDeposit",        /**its for verifying the deposit by admin */
    middlwares: [adminMiddleware , verifyTransActinon]
},
// {
//     method: "get",
//     route: "/admin/home",
//     controller: adminController,
//     action: "homeData",                  /**its for getting home data */
//     middlwares: [adminMiddleware]
// }, 
// {
//     method: "get",
//     route: "/admin/withdraw/pending",
//     controller: adminController,
//     action: "getAllWithdrawals",         /**its for getting all pendings withdrawal requests */
//     middlwares: [adminMiddleware]
// }, 
{
    method: "put",
    route: "/admin/withdraw/:transActionId",
    controller: adminController,
    action: "approveWithdrawal",         /**its for approve withdraw by admin after pay to user */
    middlwares: [adminMiddleware , approveWithdrawalDTO]
}, 
// {
//     method: "get",
//     route: "/admin/user/:userId",
//     controller: adminController,
//     action: "getUserInfo",              /**its for get user ifo by admin */
//     middlwares: [adminMiddleware]
// },
// {
//     method: "get",
//     route: "/admin/withdraw/succeed",
//     controller: adminController,
//     action: "getSucceedWithdrawal",      /**its for getting succeeded withdrawal  */
//     middlwares: [adminMiddleware]
// },
// {
//     method: "get",
//     route: "/admin/deposit/failed",
//     controller: adminController,
//     action: "allFailedDeposit",           /**its for ggetting all failed deposit  */
//     middlwares: [adminMiddleware]
// },
// {
//     method: "get",
//     route: "/admin/transactions/buy",
//     controller: adminController,
//     action: "getBuyTransAction",           /**its for getting all buy transactions  */
//     middlwares: [adminMiddleware]
// },
// {
//     method: "get",
//     route: "/admin/transactions/sell",
//     controller: adminController,
//     action: "getSellTransAction",           /**its for getting all sell transactions  */
//     middlwares: [adminMiddleware]
// },
// {
//     method: "get",
//     route: "/admin/transactions/init",
//     controller: adminController,
//     action: "getUserForInitTransactions",           /**its for getting all sell transactions  */
//     middlwares: [adminMiddleware]
// },{
//     method: "get",
//     route: "/admin/transactions/:userId",
//     controller: adminController,
//     action: "getUserForInitTransactions",           /**its for getting all sell transactions  */
//     middlwares: [adminMiddleware]
// },




/**
 * this route is for logger to check the service status
 * status checker
 */
// {
//     method: "get",
//     route: "/monitor/all",
//     controller: interServiceController,
//     action: "getStatus",                     // get status by logger service
//     middlwares: []
// },
{
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
},

/**
 * this rout is for home page charts
 */
// {
//     method: "get",
//     route: "/home/charts",
//     controller: adminController,
//     action: "homeData",
//     middlwares: [adminMiddleware]
// },
/**
 * 
 * create buy invocie in call center
 */

{
    method: "post",
    route: "/call/create",
    controller: PhoneInvoiceController,
    action: "createPhoneBuyInvoice",
    middlwares: [adminMiddleware]
},
{
    method: "post",
    route: "/call/initbuy",
    controller: PhoneInvoiceController,
    action: "intiPhoneBuyInvoice",
    middlwares: [adminMiddleware]
},
{
    method: "post",
    route: "/call/initsell",
    controller: PhoneInvoiceController,
    action: "intiPhoneSellInvoice",
    middlwares: [adminMiddleware]
},


{
    method: "put",
    route: "/call/approve/:id",
    controller: PhoneInvoiceController,
    action: "approvePhoneBuyInvoice",
    middlwares: [adminMiddleware]
},
{
    method: "put",
    route: "/call/reject/:id",
    controller: PhoneInvoiceController,
    action: "rejectPhoneBuyInvocie",
    middlwares: [adminMiddleware]
},
// {
//     method: "get",
//     route: "/call",
//     controller: PhoneInvoiceController,
//     action: "getAllBuyPhoneInvoice",
//     middlwares: [adminMiddleware]
// },
{
    method: "put",
    route: "/call/update/:id",
    controller: PhoneInvoiceController,
    action: "updatePhoneInvoice",
    middlwares: [adminMiddleware]
},
// {
//     method: "get",
//     route: "/call/status/:status",
//     controller: PhoneInvoiceController,
//     action: "getBuyPhoneInvoice",
//     middlwares: [adminMiddleware]
// },
// {
//     method: "get",
//     route: "/call/user",
//     controller: PhoneInvoiceController,
//     action: "getAllPhoneTransactionForUser",
//     middlwares: [authenticate]
// },

{
    method: "post",
    route: "/inperson/convert/sell",
    controller: invoiceConvertorController,
    action: "createConver",
    middlwares: [adminMiddleware]
},

{
    method: "post",
    route: "/inperson/convert/create",
    controller: invoiceConvertorController,
    action: "createTransAction",
    middlwares: [adminMiddleware]
},
{
    method: "post",
    route: "/inperson/convert/payment/:id",
    controller: invoiceConvertorController,
    action: "setPayment",
    middlwares: [adminMiddleware]
},
// {
//     method: "get",
//     route: "/inperson/convert/all",
//     controller: invoiceConvertorController,
//     action: "getAllConvertsInvoice",
//     middlwares: [adminMiddleware]
// },
// {
//     method: "get",
//     route: "/inperson/convert/:id",
//     controller: invoiceConvertorController,
//     action: "getSpecificConvertInvoice",
//     middlwares: [adminMiddleware]
// },

/**
 * sell call
*/

{
    method: "post",
    route: "/callsell/create",
    controller: PhoneInvoiceController,
    action: "createSellCall",
    middlwares: [adminMiddleware]
},
// {
//     method: "get",
//     route: "/selllist",
//     controller: PhoneInvoiceController,
//     action: "getAllSellPhoneInvoice",
//     middlwares: [adminMiddleware]
// },
{
    method: "get",
    route: "/callsell/user",
    controller: PhoneInvoiceController,
    action: "getAllSellPhoneTransactionForUser",
    middlwares: [authenticate]
},
// {
//     method: "get",
//     route: "/callsell/status/:status",
//     controller: PhoneInvoiceController,
//     action: "getSellPhoneInvoice",
//     middlwares: [adminMiddleware]
// }

/**
 * this route is just for test
 */
// ,{
//     method: "get",
//     route: "/test/:phone",
//     controller: InvoiceTypeController,
//     action: "test",
//     middlwares: []
// },
//////////////////////////////////////////////////////////////////////////
//remmiteance
//////////////////////////////////////////////////////////////////////////

{
    method: "post",
    route: "/users/check",
    controller: UserController,
    action: "checkIdentity",
    middlwares: [adminMiddleware]
}, {
    method: "post",
    route: "/users/newuser",
    controller: UserController,
    action: "approveNewUser",
    middlwares: [adminMiddleware]
}

// //! remmitance controller
// ,{
//     method: "post",
//     route: "/sell",
//     controller: RemittanceController,
//     action: "createSell",
//     middlware: [adminMiddleware]
// }, {
//     method: "post",
//     route: "/buy",
//     controller: RemittanceController,
//     action: "createBuy",
//     middlware: [adminMiddleware]

// }, {
//     method: "post",
//     route: "/approve/:id",
//     controller: RemittanceController,
//     action: "approveRemmitance",
//     middlware: [adminMiddleware]
// }, {
//     method: "post",
//     route: "/reject/:id",
//     controller: RemittanceController,
//     action: "rejectRemmitance",
//     middlware: [adminMiddleware]
// },

// , {
//     method: "put",
//     route: "/update/:id",
//     controller: RemittanceController,
//     action: "updateRemmitance",
//     middlware: [adminMiddleware]
// }
// ,{
//     method: "get",
//     route: "/buy/:status",
//     controller: RemittanceController,
//     action: "getByStatusBuyRemmitance",
//     middlware: [adminMiddleware]
// },
// {
//     method: "get",
//     route: "/sell/:status",
//     controller: RemittanceController,
//     action: "getByStatusSellRemmitance",
//     middlware: [adminMiddleware]
// },{
//     method: "get",
//     route: "/invoice/sell/:phone/:status",
//     controller: interServiceController,
//     action: "getAllSellInvoices",
//     middlware: []
// },
// , {
//     method: "get",
//     route: "/invoice/buy/:phone/:status",
//     controller: interServiceController,
//     action: "getAllBuyInvoices",
//     middlware: []
// },


]

