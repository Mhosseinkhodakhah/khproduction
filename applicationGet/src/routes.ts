import { UserController } from "./controller/UserController"
import { InvoiceController } from "./controller/InvoiceController";
import { WalletController } from "./controller/WalletController";
import { authenticate } from "./middlware/authenticate";
import { BankAccountController } from "./controller/BankAccountController";
import { GoldPriceController } from "./controller/GoldPriceController";
import { InvoiceTypeController } from "./controller/InvoiceTypeController";
import { PhoneInvoiceController } from "./controller/phoneInvoce.controller"
import { transactionStatusBody } from "./DTO/onlineInvoice.dto"
import interServiceController from "./controller/interservice.controller";
import adminController from "./controller/admin.controller";
import { adminMiddleware } from "./middlware/auth";
import inPersonController from "./controller/inPerson.controller";
import invoiceConvertorController from "./controller/inpersonConvert.controller";
import { RemittanceController } from "./controller/RemittanceController";


export const Routes = [

    {
        method: "post",
        route: "/trade/permision",
        controller: adminController,
        action: "tradePermision",
        middlwares: [adminMiddleware]
    },
    {
        method: "get",
        route: "/trade",
        controller: adminController,
        action: "getTradePermision",
        middlwares: [adminMiddleware]
    },
    {
        method: "get",
        route: "/token/check",
        controller: UserController,
        action: "checkToken",
        middlwares: [authenticate]
    },
    {
        method: "get",
        route: "/users",
        controller: UserController,
        action: "all",
        middlwares: [authenticate]
    }, {
        method: "get",
        route: "/ddellete/:phoneNumber",
        controller: UserController,
        action: "remove",
        middlwares: []
    }, {
        method: "get",
        route: "/profile",
        controller: UserController,
        action: "profile",
        middlwares: [authenticate]

    },
    {
        method: "get",
        route: "/transactions/:type",
        controller: InvoiceController,
        action: "getTransactions",
        middlwares: [authenticate]
    }, {
        method: "post",
        route: "/selltransactions",
        controller: InvoiceController,
        action: "getAllTransactionsSellType",
        middlwares: [authenticate, transactionStatusBody]
    }, {
        method: "post",
        route: "/buytransactions",
        controller: InvoiceController,
        action: "getAllTransactionsBuyType",
        middlwares: [authenticate, transactionStatusBody]

    }, {
        method: "post",
        route: "/specific-transaction/:id",
        controller: InvoiceController,
        action: "getTransactionById",
        middlwares: [authenticate]
    }, {
        method: "get",
        route: "/wallet",
        controller: WalletController,
        action: "getWallet",
        middlwares: [authenticate]
    }, {
        method: "get",
        route: "/interService/wallet/:id",
        controller: interServiceController,
        action: "getWallet",
        middlwares: []
    },
    {
        method: "get",
        route: "/carts",
        controller: BankAccountController,
        action: "all",
        middlwares: [authenticate]
    },
    {
        method: "get",
        route: "/carts/all",
        controller: BankAccountController,
        action: "allBanks",
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
        method: "get",
        route: "/goldPrice",
        controller: GoldPriceController,
        action: "getGoldPrice",
        middlwares: [authenticate]
    }, {
        method: "get",
        route: "/admin/goldPrice",
        controller: GoldPriceController,
        action: "adminGetGoldPrice",
        middlwares: [adminMiddleware]
    }
    , {
        method: "get",
        route: "/goldPrice/handle",
        controller: GoldPriceController,
        action: "getHandleGoldPrice",
        middlwares: [adminMiddleware]
    },
    {
        method: "get",
        route: "/goldPrice/:date",
        controller: GoldPriceController,
        action: "getGoldPriceForDate",
        middlwares: [adminMiddleware]
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
        method: "get",
        route: "/dashboard",
        controller: UserController,
        action: "charts",
        middlwares: [authenticate]
    },
    {
        method: "get",
        route: "/inperson/sell/all/:status",
        controller: inPersonController,
        action: "getAllSellPending",         /**its for get all pending inperson purchase */
        middlwares: [adminMiddleware]
    },
    {
        method: "get",
        route: "/inperson/buy/all/:status",
        controller: inPersonController,
        action: "getAllBuyPending",         /**its for get all pending inperson purchase */
        middlwares: [adminMiddleware]
    },
    {
        method: "get",
        route: "/admin/users/all",
        controller: adminController,
        action: "getAllUsers",              /**its for get all users by admin */
        middlwares: [adminMiddleware]
    },
    {
        method: "get",
        route: "/admin/wallet/all",
        controller: adminController,
        action: "getAllWallet",             /**its for get all wallet by admin */
        middlwares: [adminMiddleware]
    },
    {
        method: "get",
        route: "/admin/transactions/all",
        controller: adminController,
        action: "getAllTransActions",        /**its for get all transActions by admin */
        middlwares: [adminMiddleware]
    },
    {
        method: "get",
        route: "/admin/deposit/pending",
        controller: adminController,
        action: "getAllPendingsDeposit",       /**its for getting all pendings deposit with admin */
        middlwares: [adminMiddleware]
    },
    {
        method: "get",
        route: "/admin/deposit/succeed",
        controller: adminController,
        action: "getAllSucceedDeposit",       /**its for getting all succeed deposit with admin */
        middlwares: [adminMiddleware]
    },
    {
        method: "get",
        route: "/admin/home",
        controller: adminController,
        action: "homeData",                  /**its for getting home data */
        middlwares: [adminMiddleware]
    }, {
        method: "get",
        route: "/admin/withdraw/pending",
        controller: adminController,
        action: "getAllWithdrawals",         /**its for getting all pendings withdrawal requests */
        middlwares: [adminMiddleware]
    },
    {
        method: "get",
        route: "/admin/user/:userId",
        controller: adminController,
        action: "getUserInfo",              /**its for get user ifo by admin */
        middlwares: [adminMiddleware]
    }, {
        method: "get",
        route: "/admin/withdraw/succeed",
        controller: adminController,
        action: "getSucceedWithdrawal",      /**its for getting succeeded withdrawal  */
        middlwares: [adminMiddleware]
    }, {
        method: "get",
        route: "/admin/deposit/failed",
        controller: adminController,
        action: "allFailedDeposit",           /**its for ggetting all failed deposit  */
        middlwares: [adminMiddleware]
    }, {
        method: "get",
        route: "/admin/transactions/buy",
        controller: adminController,
        action: "getBuyTransAction",           /**its for getting all buy transactions  */
        middlwares: [adminMiddleware]
    }, {
        method: "get",
        route: "/admin/transactions/sell",
        controller: adminController,
        action: "getSellTransAction",           /**its for getting all sell transactions  */
        middlwares: [adminMiddleware]
    }, {
        method: "get",
        route: "/admin/transactions/init",
        controller: adminController,
        action: "getUserForInitTransactions",           /**its for getting all sell transactions  */
        middlwares: [adminMiddleware]
    }, {
        method: "get",
        route: "/admin/transactions/:userId",
        controller: adminController,
        action: "getUserForInitTransactions",           /**its for getting all sell transactions  */
        middlwares: [adminMiddleware]
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
    },
    /**
     * this rout is for home page charts
     */
    {
        method: "get",
        route: "/home/charts",
        controller: adminController,
        action: "homeData",
        middlwares: [adminMiddleware]
    },
    {
        method: "get",
        route: "/call",
        controller: PhoneInvoiceController,
        action: "getAllBuyPhoneInvoice",
        middlwares: [adminMiddleware]
    },
    {
        method: "get",
        route: "/call/status/:status",
        controller: PhoneInvoiceController,
        action: "getBuyPhoneInvoice",
        middlwares: [adminMiddleware]
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
        route: "/inperson/convert/all",
        controller: invoiceConvertorController,
        action: "getAllConvertsInvoice",
        middlwares: [adminMiddleware]
    },
    {
        method: "get",
        route: "/inperson/convert/:id",
        controller: invoiceConvertorController,
        action: "getSpecificConvertInvoice",
        middlwares: [adminMiddleware]
    },

    {
        method: "get",
        route: "/selllist",
        controller: PhoneInvoiceController,
        action: "getAllSellPhoneInvoice",
        middlwares: [adminMiddleware]
    },
    {
        method: "get",
        route: "/callsell/user",
        controller: PhoneInvoiceController,
        action: "getAllSellPhoneTransactionForUser",
        middlwares: [authenticate]
    },
    {
        method: "get",
        route: "/callsell/status/:status",
        controller: PhoneInvoiceController,
        action: "getSellPhoneInvoice",
        middlwares: [adminMiddleware]
    }

    /**
     * this route is just for test
     */
    , {
        method: "get",
        route: "/test/:phone",
        controller: InvoiceTypeController,
        action: "test",
        middlwares: []
    },
    , {
        method: "get",
        route: "/buy/:status",
        controller: RemittanceController,
        action: "getByStatusBuyRemmitance",
        middlwares: [adminMiddleware]
    },
    {
        method: "get",
        route: "/sell/:status",
        controller: RemittanceController,
        action: "getByStatusSellRemmitance",
        middlwares: [adminMiddleware]
    }, {
        method: "get",
        route: "/invoice/sell/:phone/:status",
        controller: interServiceController,
        action: "getAllSellInvoices",
        middlwares: []
    },
    , {
        method: "get",
        route: "/invoice/buy/:phone/:status",
        controller: interServiceController,
        action: "getAllBuyInvoices",
        middlwares: []
    }, 
    // {
    //     method: "get",
    //     route: "/checkmyfuckedups",
    //     controller: UserController,
    //     action: "userAndOld",
    //     middlwares: []
    // },
    {
        method: "get",
        route: "/admin/inquiry/:nationalCode",
        controller: adminController,
        action: "getWallet",
        middlwares: [adminMiddleware]
    },{  
        method: "get",
        route: "/admin/transport/all",
        controller: adminController,
        action: "getAllTransport",
        middlwares: [adminMiddleware]
    },{
        method: "get",
        route: "/user/glance",
        controller: adminController,
        action: "getUsersForGlance",
        middlwares: [adminMiddleware]
    }
]

