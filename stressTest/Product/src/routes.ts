import { ProductController } from "./controller/ProductController"
import { CategoryController } from "./controller/CategoryController"
import { authMiddlewareAdmin, authMiddlewareUser } from "./middleware/auth"
import { ProductItemController } from "./controller/ProductItemController"
import { CartController } from "./controller/CartController"
import {
    validatorCreateCategoryBody,
    validatorUpdateCategoryBody,
    validatorCreateProductBody, 
    validatorUpdateProductBody,
    validatorCreateProductItem,
    validatorUpdateProductItem,
    validatorUpdateCountProductItem,
    validatorAddToCard
} 
from "./middleware/validator"

export const Routes = [{
    method: "get",
    route: "/products",
    controller: ProductController,
    action: "all",
    middlware:[]
}, {
    method: "get",
    route: "/products/:id",
    controller: ProductController,
    action: "one",
    middlware:[]
}, {
    method: "post",
    route: "/admin/products",
    controller: ProductController,
    action: "save",
    middlware:[authMiddlewareAdmin,validatorCreateProductBody]
}, {
    method: "delete",
    route: "/admin/products/:id",
    controller: ProductController,
    action: "remove",
    middlware:[authMiddlewareAdmin]
},{
    method: "put",
    route: "/admin/products/:id",
    controller: ProductController,
    action: "update",
    middlware:[authMiddlewareAdmin,validatorUpdateProductBody]
},
// productItems routes


{
    method: "get",
    route: "/productitem/:id",
    controller: ProductItemController,
    action: "all",
    middlware:[]
}, {
    method: "get",
    route: "/singelitem/:id",
    controller: ProductItemController,
    action: "one",
    middlware:[]
}, {
    method: "post",
    route: "/admin/productitem/:id",
    controller: ProductItemController,
    action: "save",
    middlware:[validatorCreateProductItem]
}, {
    method: "delete",
    route: "/admin/productitem/:id",
    controller: ProductItemController,
    action: "remove",
    middlware:[authMiddlewareAdmin]
},{
    method: "put",
    route: "/admin/productitem/:id",
    controller: ProductItemController,
    action: "update",
    middlware:[authMiddlewareAdmin,validatorUpdateProductItem]
},

,{
    method: "post",
    route: "/internal/productitem/updatecount/:id/:pid",
    controller: ProductItemController,
    action: "update",
    middlware:[authMiddlewareAdmin,validatorUpdateCountProductItem]
},



// Category Routes

{
    method: "get",
    route: "/category",
    controller: CategoryController,
    action: "all",
    middlware:[]
}, {
    method: "get",
    route: "/category/:id",
    controller: CategoryController,
    action: "one",
    middlware:[]
}, {
    method: "post",
    route: "/admin/category/:id",
    controller: CategoryController,
    action: "save",
    middlware:[authMiddlewareAdmin,validatorCreateCategoryBody]
}, 
{
    method: "post",
    route: "/admin/category",
    controller: CategoryController,
    action: "saveParent",
    middlware:[authMiddlewareAdmin,validatorCreateCategoryBody]
},
{
    method: "delete",
    route: "/admin/category/:id",
    controller: CategoryController,
    action: "remove",
    middlware:[authMiddlewareAdmin]
},
{
    method: "put",
    route: "/admin/category/:id",
    controller: CategoryController,
    action: "update",
    middlware:[authMiddlewareAdmin,validatorUpdateCategoryBody]
},


//! card section


{
    method: "post",
    route: "/card/add",
    controller: CartController,
    action: "addToCart",
    middlware:[authMiddlewareUser,validatorAddToCard]
},

{
    method: "get",
    route: "/card",
    controller: CartController,
    action: "getCart",
    middlware:[authMiddlewareUser]
},

{
    method: "get",
    route: "/card/remove/:id",
    controller: CartController,
    action: "removeFromCart",
    middlware:[authMiddlewareUser]
},



]