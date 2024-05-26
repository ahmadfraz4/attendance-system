import mongoose from "mongoose";
import { AsyncHandler } from "../utils/AsyncHandler.js";

let RequestSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'Student',
        required : true,
    },
    application : {
        type : String, required : true,
    },
    leaveDates : {type : [Date] , required : true, default : [new Date(Date.now())] }, // array of dates
    approval : {type : String, default : 'pending'}
})

export let RequestModel = mongoose.model('Request', RequestSchema);