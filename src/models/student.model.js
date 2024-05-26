import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";
const AutoIncrement = mongooseSequence(mongoose);
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";

let studentSchema =new mongoose.Schema({
    name : {
        type : String, required : true,
    },
    rollNo : {
        type : Number, unique:true
    },
    password : {
        type : String, required : true,
    },
    role : {
        type : String, required : true, default : 'user',
    },
    profilePic : {
        type : String, required : true
    },
    joinAt : {
        type : Date, required : true, default : new Date(Date.now()),
    },
    AttendacePercentage : {
        type : Number, required : true, default : 0,
    }
})

studentSchema.plugin(AutoIncrement, {inc_field : 'rollNo'}); // for auto increment of roll no in student model


studentSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
       return next();
    }
    this.password = await bcrypt.hash(this.password, 10); // 12 is more safe
    next();
})

studentSchema.methods.generateToken = function(){
    let token = jwt.sign({_id : this._id}, process.env.JWT_KEY, {expiresIn : process.env.EXPIRE_JWT});
    return token;
}


let StudentModel = mongoose.model('Student', studentSchema);

export {StudentModel}