import interservice from "./controller/interservice.controller"
import { UserController } from "./controller/UserController"

export const Routes = [{
    method: "get",
    route: "/charts",
    controller: UserController,
    action: "charts"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "get",
    route: "/monitor/all",
    controller: interservice,
    action: "getStatus"
},{
    method: "get",
    route: "/interservice/wallet/all",
    controller: UserController,
    action: "getAllWalletTransactionsForDjango",                   // this rout is for get all invoices for django service
    middlwares: []
},{
    method: "get",
    route: "/interservice/invoice/all",
    controller: UserController,
    action: "getAllInvoicesForDjango",                   // this rout is for get all invoices for django service
    middlwares: []
},{
    method: "get",
    route: "/interservice/user/all",
    controller: UserController,
    action: "getAllUserForDjango",                   // this rout is for get all invoices for django service
    middlwares: []
},
{
    method: "get",
    route: "/interservice/report/hour",
    controller: UserController,
    action: "getHourlyForDjango",                   // this rout is for get all invoices for django service
    middlwares: []
}
,{
    method: "get",
    route: "/charts/app/:id",
    controller: UserController,
    action: "applicationCharts"
},{
    method: "get",
    route: "/interservice/userExistance/:phoneNumber",
    controller: UserController,
    action: "checkUserExistance",           // check existance of use by oldUser service
    middlwares: []
},
{
    method: "get",
    route: "/test",
    controller: UserController,
    action: "test",           // check existance of use by oldUser service
    middlwares: []
},


]