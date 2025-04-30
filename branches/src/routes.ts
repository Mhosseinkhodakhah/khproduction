import branchController from "./controller/branch.controller"
import { interService } from "./controller/interservice.controller"
import { UserController } from "./controller/UserController"
import { createBranchDto } from "./entity/dto/branchDto.dto"
import { addSellerDto } from "./entity/dto/createSellerDto"
import { approveDataDto, approveOtpDataDto, createTransActionDto } from "./entity/dto/transAction.dto"
import { authenticate } from "./middleware/authenticate"

export const Routes = [
    {
    method: "post",
    route: "/create",
    controller: branchController,
    middlewares:[createBranchDto],
    action: "createNewBranch"
},
{
    method: "post",
    route: "/seller/create/:branchId",
    controller: branchController,
    middlewares:[addSellerDto],
    action: "addSeller"
},
{
    method: "get",
    route: "/all",
    controller: branchController,
    middlewares:[],
    action: "getAllBranches"
},
{
    method: "get",
    route: "/seller/all/:branchId",
    controller: branchController,
    middlewares:[],
    action: "getSellers"
},
{
    method: "post",
    route: "/transAction/create",
    controller: UserController,
    middlewares:[authenticate , createTransActionDto],
    action: "createTransAction"
},{
    method: "post",
    route: "/transAction/otp",
    controller: UserController,
    middlewares:[authenticate , approveDataDto],
    action: "approveTransACtionDataByUser"
},{
    method: "post",
    route: "/transAction/otp/verify",
    controller: UserController,
    middlewares:[authenticate , approveOtpDataDto],
    action: "approveOtpCodeFor"
}
,{
    method: "get",
    route: "/monitor/all",
    controller: interService,
    action: "getStatus",                     // get status by logger service
    middlewares: []
},{
    method: "get",
    route: "/allbyadmin",
    controller: branchController,
    middlewares:[],
    action: "getAllBranchesByAdmin"
},
{
    method: "get",
    route: "/seller/allbyadmin/:branchId",
    controller: branchController,
    middlewares:[],
    action: "getSellersByAdmin"
}
]
