import { UserController } from "./controller/UserController"
import { RemittanceController } from "./controller/RemittanceController"
import { adminMiddleware } from "./middlware/auth"
import interserviceController from "./controller/interservice.controller"

export const Routes = [{
    method: "post",
    route: "/users/check",
    controller: UserController,
    action: "checkIdentity",
    middlware: [adminMiddleware]
}, {
    method: "post",
    route: "/users/newuser",
    controller: UserController,
    action: "approveNewUser",
    middlware: [adminMiddleware]
}

    //! remmitance controller

    , {
        method: "post",
        route: "/sell",
        controller: RemittanceController,
        action: "createSell",
        middlware: [adminMiddleware]
    }, {
        method: "post",
        route: "/buy",
        controller: RemittanceController,
        action: "createBuy",
        middlware: [adminMiddleware]

    }, {
        method: "post",
        route: "/approve/:id",
        controller: RemittanceController,
        action: "approveRemmitance",
        middlware: [adminMiddleware]
    }, {
        method: "post",
        route: "/reject/:id",
        controller: RemittanceController,
        action: "rejectRemmitance",
        middlware: [adminMiddleware]
    },

    , {
        method: "put",
        route: "/update/:id",
        controller: RemittanceController,
        action: "updateRemmitance",
        middlware: [adminMiddleware]
    }
    ,{
        method: "get",
        route: "/buy/:status",
        controller: RemittanceController,
        action: "getByStatusBuyRemmitance",
        middlware: [adminMiddleware]
    },
    {
        method: "get",
        route: "/sell/:status",
        controller: RemittanceController,
        action: "getByStatusSellRemmitance",
        middlware: [adminMiddleware]
    },
    {
        method: "get",
        route: "/monitor/all",
        controller: UserController,
        action: "getStatus",
        middlware: []
    },
    {
        method: "post",
        route: "/user/delete",
        controller: UserController,
        action: "deleteUserWithPhoneNumber",
        middlware: []
    }, {
        method: "get",
        route: "/invoice/sell/:phone/:status",
        controller: interserviceController,
        action: "getAllSellInvoices",
        middlware: []
    },
    , {
        method: "get",
        route: "/invoice/buy/:phone/:status",
        controller: interserviceController,
        action: "getAllBuyInvoices",
        middlware: []
    },

]