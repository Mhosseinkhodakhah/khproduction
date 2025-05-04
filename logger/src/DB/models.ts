import mongoose, { Schema, model } from 'mongoose';
import Joi from 'joi';
import { logs, userLogs } from '../interfaces';


export const MovieSchemaValidate = Joi.object({
    title: Joi.string().required(),
    genre: Joi.string().required(),
    synopsis: Joi.string().required()
});

const userLogSchema = new Schema<userLogs>({                    // this is the logs schema for saving on database
    user : {
        firstName : {type:String},
        lastName : {type : String},
        phoneNumber : {type : String}
    },
    
    title : {type : String},

    description : {type : String},

    action : {},              // 0 : sell   1: buy   3 : withdraw   4 : deposit   5 : transport    6: delete card   7: add card   8: login   9 : register

    date : { type : String , default : ''},

    time : {type : String , default : ''},
    
    status : {type : Number}           // 0 : failed    1: success

}, { timestamps: true })


const userLogsModel = model<userLogs>('userLogs', userLogSchema)


export default userLogsModel;