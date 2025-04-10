import interServiceController from "./controller/interservice.controller"
import { UserController } from "./controller/UserController"
import { adminMiddleware } from "./middleware/auth"
import {validatorApproveBody,validatorCheckIdentifyBody} from "./middleware/validator"

export const Routes = [
    {
        method: "post",
        route: "/identity/status",
        controller: UserController,
        action: "checkIdentity",                     // checking identity of user
        middleware : [adminMiddleware,validatorCheckIdentifyBody]
    }, 
    {
        method: "get",
        route: "/identity/otp/:phone",
        controller: UserController,
        action: "sendOtpForApprove",                     // checking identity of user
        middleware : [adminMiddleware]
    },
    {
        method: "get",
        route: "/users",
        controller: UserController,
        action: "allUsers",                          // getting all user,
        middleware : [adminMiddleware]
    },{
        method: "get",
        route: "/users/:id",
        controller: UserController,
        action: "getOneUser",                          // getting all user
        middleware : [adminMiddleware]
    },
     {
        method: "post",
        route: "/approve/:id",
        controller: UserController,
        action: "approveOldUser",        // verifying identity if user was not verified . . .
        middlwares: [adminMiddleware,validatorApproveBody]
    }
    ,
     {
        method: "post",
        route: "/approvenew",
        controller: UserController,
        action: "approveNewUser",        // verifying identity if user was not verified . . .
        middlwares: [adminMiddleware,validatorApproveBody]
    }
    , {
        method: "post",
        route: "/invoice/create",
        controller: UserController,
        action: "createInvoice",                   // make order with state 0 : just init  and after that it should send sms
        middlwares: [adminMiddleware]
    }, {
        method: "post",
        route: "/invoice/update/:invoiceId?",
        controller: UserController,
        action: "updateInvoice",                    // here is for updating the invoice if it needed
        middlwares: [adminMiddleware]
    }, {
        method: "get",
        route: "/invoice/all",
        controller: UserController,
        action: "getAllInvoices",                    // here is for getting all invoices
        middlwares: [adminMiddleware]
    }, {
        method: "get",
        route: "/invoice/:userId",
        controller: UserController,
        action: "getUserInvoices",                  // here is for getting user invoices
        middlwares: [adminMiddleware]
    }, {
        method: "post",
        route: "/createTransaction",
        controller: UserController,
        action: "createTransaction",                // here is for creating the transactions
        middlwares: [adminMiddleware]
    },{
        method: "get",
        route: "/getOldUsers",
        controller: UserController,
        action: "getAllOldUsers",                // here is for creating the transactions
        middlwares: [adminMiddleware]
    },{
        method: "get",
        route: "/test",
        controller: UserController,
        action: "clean",                // here is for creating the transactions
        middlwares: []
    },{
        method: "post",
        route: "/runthescript",
        controller: UserController,
        action: "script",                // here is for creating the transactions
        middlwares: []
    },
    {
        method: "get",
        route: "/monitor/all",
        controller: interServiceController,
        middleware: [],
        action: "getLoggs"                // here is for logger service that get all monitor requests
    }, {
        method: "get",
        route: "/interservice/getAll",
        controller: interServiceController,
        middleware: [],
        action: "allUsers"                // here is for last service that get all monitor requests
    },
    {
        method: "get",
        route: "/interservice/check-user/:phoneNumber",
        controller: interServiceController,
        middleware: [],
        action: "checkOldUser"                // here is for last service that check user in the oldUsers
    },
    {
        method: "get",
        route: "/interservice/user/all",
        controller: interServiceController,
        middleware: [],
        action: "getAllUsers"                // here is for last service that check user in the oldUsers
    }, {
        method: "post",
        route: "/interservice/approve-user/:id",
        controller: interServiceController,
        middleware: [],
        action: "changeUserStatus"                // here is for last service that change user status in the oldUsers
    },
    {
        method: "post",
        route: "/interservice/check/:phoneNumber/:nationalCode",
        controller: interServiceController,
        middleware: [],
        action: "checkOldWithPhoneOrNatnialCode"                // here is for last service that check user in the oldUsers
    },

]

