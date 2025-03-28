import { OldUserController } from "./controller/OldUserController"
import { authMiddleware } from "./middleware/auth"



export const Routes = [{
    method: "get",
    route: "/products",
    controller: OldUserController,
    action: "all",
    middlware:[]
}, {
    method: "get",
    route: "/exel",
    controller: OldUserController,
    action: "extractExel",
    middlware:[]
},

]