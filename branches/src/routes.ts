import branchController from "./controller/branch.controller"
import { UserController } from "./controller/UserController"
import { createBranchDto } from "./entity/dto/branchDto.dto"
import { addSellerDto } from "./entity/dto/createSellerDto"

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
    middlewares:[],
    action: "createTransAction"
}

]