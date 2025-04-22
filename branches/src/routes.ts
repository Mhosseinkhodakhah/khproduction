import branchController from "./controller/branch.controller"
import { UserController } from "./controller/UserController"
import { createBranchDto } from "./entity/dto/branchDto.dto"

export const Routes = [
    {
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: "/branch/create",
    controller: branchController,
    middlewares:[createBranchDto],
    action: "createNewBranch"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
}]