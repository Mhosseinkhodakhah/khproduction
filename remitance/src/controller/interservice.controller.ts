import { AppDataSource } from "../data-source";
import { Remmitance } from "../entity/Remmitance";
import { NextFunction, Request, Response } from "express"



export default class interserviceController{
    private readonly invoicesRepository = AppDataSource.getRepository(Remmitance)



    async getAllSellInvoices(req : Request , res : Response , next : NextFunction){
        const status=req.params.status
        console.log(req.params.status , req.params.phone); 
       const  queryBuilder =this.invoicesRepository.createQueryBuilder('invoice')
       .leftJoinAndSelect('invoice.seller' , 'seller')
       .where('seller.phoneNumber =:phone',{phone:req.params.phone})

       if(status!=="all"){
        queryBuilder
        .andWhere('invoice.status = :status',{status:status})
       }

     
       const invoices=await queryBuilder
       .orderBy('invoice.createdAt', 'DESC')
       .getMany()
       

        return res.status(200).json({
            data : invoices
        })
        
    }


    async getAllBuyInvoices(req : Request , res : Response , next : NextFunction){
        const status=req.params.status
        console.log(req.params.status , req.params.phone);
        
        const  queryBuilder =this.invoicesRepository.createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.buyer' , 'buyer')
        .where(' buyer.phoneNumber = :phone ',{phone:req.params.phone})
        if(status!=="all"){
            queryBuilder
            .andWhere('invoice.status = :status',{status:status})
        }
 
 
        const invoices=await queryBuilder
        .orderBy('invoice.createdAt', 'DESC')
        .getMany()
        

        
         return res.status(200).json({
             data : invoices
         })

    }



}