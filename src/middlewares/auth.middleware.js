import { StudentModel } from "../models/student.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import jwt from 'jsonwebtoken'
export let auth = AsyncHandler(async (req, res, next) => {
    let token = req.cookies.token;
    if(!token){
        return res.json(new ApiResponse( 401,false, 'Unautorize User'))
    }
    let decoded = await jwt.verify(token, process.env.JWT_KEY);
    let user = await StudentModel.findById(decoded._id);
    
    if(!user){
        return res.json(new ApiResponse( 401,false, 'Your account has already been deleted'))
    }

    req.user = user;
    next();
});

export let authorizeRole = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
           return res.json(new ApiResponse(401, false , `${(req.user.role)} is not allow to access this resource`))
        }
        next();
    };
}