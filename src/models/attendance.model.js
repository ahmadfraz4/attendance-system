import mongoose from "mongoose";

let AttendanceSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'Student'
    },
    isPresent : {
        type : Boolean, default : false, required : true
    },
    date : {
        type : Date, required : true
    },
    marked : {
        type : Boolean, default : false,
    }
},{timestamps : true})

AttendanceSchema.statics.canMarkAttendance = async function(studentId, time){
    let startOfDay = new Date(time);
    startOfDay.setHours(0,0,0,0); // eg, 18-May 00:00 am means start of the day
    let endOfDay = new Date(time);
    endOfDay.setHours(23, 59, 59, 999); // eg, 18-May 12:59 am means end of the day 

    let attendance = await this.findOne({
        user : studentId, 
        marked : true, // if user has marked his attendance than can't be changed
        date : {$gte : startOfDay, $lte : endOfDay} // checking if the user is present within 24 hours
    });
    return !attendance // if present then return false, if not then return true, purpose : user can mark attendance or not 
}

export let AttendanceModel = mongoose.model('Attendance', AttendanceSchema);