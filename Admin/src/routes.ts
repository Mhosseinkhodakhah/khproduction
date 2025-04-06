import { Router } from "express"
import { UserController } from "./controller/UserController"
import { authMiddleware } from "./middleware/auth"
import { accessPointsValidation, adminValidation, menuValidation } from "./validator"
import interServiceController from "./controller/interservice.controller"
import { createCooprationRequests } from "./DTO/coorporations"


export const Routes = [{
    method: "post",
    route: "/menu/create",
    controller: UserController,
    middleware: [authMiddleware],
    action: "createNewMenu",
}, {
    method: "post",
    route: "/menu/create/:menuId",
    controller: UserController,
    action: "creatNewSubMenu",
    middleware: [authMiddleware, menuValidation]
},
{
    method: "get",
    route: "/menu/all/:id",
    controller: UserController,
    middleware: [authMiddleware],
    action: "getAllMenu"
}, {
    method: "post",
    route: "/create",
    controller: UserController,
    middleware: [authMiddleware,adminValidation],
    action: "addNewAdmin"
}, {
    method: "post",
    route: "/access/update/:userId",
    controller: UserController,
    middleware: [authMiddleware, accessPointsValidation],
    action: "updateAccessPoints"
}, {
    method: "patch",
    route: "/update/:adminId",
    controller: UserController,
    middleware: [authMiddleware],
    action: "updateAdmin"
}, {
    method: "get",
    route: "/all",
    controller: UserController,
    middleware: [authMiddleware],
    action: "getAllAdmins"
}, {
    method: "get",
    route: "/:adminId",
    controller: UserController,
    middleware: [authMiddleware],
    action: "getAdmin"
}, {
    method: "post",
    route: "/login",
    controller: UserController,
    middleware: [],
    action: "login"
},
{
    method: "get",
    route: "/monitor/all",
    controller: interServiceController,
    middleware: [authMiddleware],
    action: "getLoggs"
},
/** these routes is for coporation requests from users */
{
    method: "put",
    route: "/coorporation",
    controller: UserController,
    middleware: [createCooprationRequests],
    action: "createCooprationRequests"
},{
    method: "get",
    route: "/coorporation/all",
    controller: UserController,
    middleware: [authMiddleware],
    action: "getAllCoorporation"
},
]