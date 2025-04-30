import mongoose, { Schema, model } from 'mongoose';
import Joi, { number } from 'joi';
import { logs } from '../interfaces';


export const MovieSchemaValidate = Joi.object({
    title: Joi.string().required(),
    genre: Joi.string().required(),
    synopsis: Joi.string().required()
});


const adminLogSchema = new Schema<logs>({                    // this is the logs schema for saving on database
    admin : {
        firstName : {type:String},
        lastName : {type : String},
    },
    
    title : {type : String},

    description : {type : String},

    actionType : number, 

    action : {},

    date : {type : String},

    time : {type : String}
    
}, { timestamps: true })


const adminLogsModel = model<logs>('adminLogs', adminLogSchema)


export default adminLogsModel;