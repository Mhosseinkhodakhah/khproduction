import branchController from "./controller/branch.controller"
import { UserController } from "./controller/UserController"
import { createBranchDto } from "./entity/dto/branchDto.dto"

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
    middlewares:[createBranchDto],
    action: "addSeller"
},
{
    method: "get",
    route: "/all",
    controller: branchController,
    middlewares:[createBranchDto],
    action: "getAllBranches"
},
{
    method: "get",
    route: "/seller/all/:branchId",
    controller: branchController,
    middlewares:[createBranchDto],
    action: "getSellers"
},
]