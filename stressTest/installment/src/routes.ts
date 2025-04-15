import interservice from "./controller/interservice.controller"
import { UserController } from "./controller/UserController"
import { verificationOfCreateInstallment } from "./dto/creaetDto"
import { adminMiddleware } from "./middleware/auth"

export const Routes = [{
    method: "post",
    route: "/create",
    controller: UserController,
    action: "submitRequests",
    middlwares : [verificationOfCreateInstallment]
},{
    method: "get",
    route: "/cities/:cityId",
    controller: UserController,
    action: "getAllCities",
    middlwares : []
}
, {
    method: "get",
    route: "/all",
    controller: UserController,
    action: "getAllInstallments",
    middlwares : [adminMiddleware]
}, {
    method: "put",
    route: "/check",
    controller: UserController,
    action: "checkRequests",
    middlwares : [adminMiddleware]
}, {
    method: "get",
    route: "/monitor/all",
    controller: interservice,
    action: "getStatus",
    middlwares : []
}]