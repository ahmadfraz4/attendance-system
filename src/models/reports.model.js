import mongoose from "mongoose";

let ReportSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'Student',
        required : true
    },
    fromDate : {
        type : Date, required : true
    },
    toDate : {
        type : Date, required : true
    },
    attendancePercentage : {
        type : Number, required : true
    },
    statics : {
        type : Array, required : true
    },
    report : {
        type : String
    },reportName : {
        type : String, unique : true, required : true
    }
})


export let ReportModel = mongoose.model('Report', ReportSchema);