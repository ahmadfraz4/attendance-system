import { StudentModel } from "../models/student.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import bcrypt from 'bcryptjs'
import fs, { existsSync } from 'fs'; 
import { fileURLToPath } from "url";
import path from "path";


let cookieOptions = {
    expires :  new Date(Date.now() + 60 * 60 * 24 * 30 * 1000), httpOnly : true
}

// ***********************************************************************************************************

export let registerUser = AsyncHandler(async (req,res) =>{
    let {name, password} = req.body;
    
    if(!name || !password){
        return res.json(new ApiResponse(400, false, "Please Fill out all the fields"));
    }

    let profilePic = req.file;
    if(!profilePic){
        return new ApiResponse(400, false, 'Profile picture is required');
    }

    let isImageValid = await validateImage(profilePic);
   
    if(!isImageValid.success){
        return res.json(new ApiResponse(400, false, isImageValid.message));
    }
    
    let reqister = await StudentModel.create({
        name, password,  profilePic : profilePic.filename
    });
    

    let token = await reqister.generateToken();
    // deleting password field to send response without password
    reqister = reqister.toObject();
    delete reqister.password;

    return res.cookie('token', token, cookieOptions ).json(new ApiResponse(200, true, reqister))
})

export let addUser = AsyncHandler(async (req,res) =>{
    let {name, password} = req.body;
    
    if(!name || !password){
        return res.json(new ApiResponse(400, false, "Please Fill out all the fields"));
    }

    let profilePic = req.file;
    if(!profilePic){
        return new ApiResponse(400, false, 'Profile picture is required');
    }

    let isImageValid = await validateImage(profilePic);
   
    if(!isImageValid.success){
        return res.json(new ApiResponse(400, false, isImageValid.message));
    }
    
    let reqister = await StudentModel.create({
        name, password,  profilePic : profilePic.filename
    });
    

    // deleting password field to send response without password
    reqister = reqister.toObject();
    delete reqister.password;

    return res.json(new ApiResponse(200, true, reqister))
})


// ***********************************************************************************************************

export let loginUser = AsyncHandler(async(req,res) =>{
    let {rollNo, password} = req.body;
    let isExist = await StudentModel.findOne({rollNo});
    if(!rollNo || !password){
        return res.json(new ApiResponse(400, false, "Please Fill out all the fields"));
    }
    if(!isExist){
        return res.json(new ApiResponse(401, false, "This roll number doesn't exist"));
    }

    let isPasswordMatch = await bcrypt.compare(password, isExist.password);
    if(!isPasswordMatch){
        return res.json(new ApiResponse(401, false, "Invalid rollNo or Password"));
    }

    let token = await isExist.generateToken();

    isExist = isExist.toObject();
    delete isExist.password
    
    return res.cookie('token', token, cookieOptions).json(new ApiResponse(200, true, isExist));
})


// ***********************************************************************************************************

export let logout = AsyncHandler(async(req,res) => {
   res.clearCookie('token').json(new ApiResponse(200, true ,'logout successfully'))
})


// ***********************************************************************************************************

export let deleteUser = AsyncHandler(async (req,res) =>{
    let user = await StudentModel.findById(req.params.id);
    if(req.user.role != 'admin'){
        if(req.params.id != req.user._id){
            return res.json(new ApiResponse(401, false, 'Unauthorized User'));
        }
    }
    
    if(!deleteProfile(user.profilePic)){
        return res.json(new ApiResponse(400, false, 'SomeThing went wrong'))
    }

    await StudentModel.findByIdAndDelete(req.params.id);
    return res.json(new ApiResponse(200, true, 'Account Deleted Successfully'))

})

// ***********************************************************************************************************

export let updateUser = AsyncHandler(async(req,res) => {
    let { name } = req.body;
    let profilePic = req?.file;

    let user  = await StudentModel.findById(req.user._id);

    if(user.role != 'admin'){
        if(req.user._id != req.params.id){
            deleteProfile(profilePic.filename)
            return res.json(new ApiResponse(401, false, 'Unauthorized User'));
        }
    }

    let previous = await StudentModel.findById(req.params.id);

    if(profilePic){
        let isImageValid = profilePic ? await validateImage(profilePic) : false;
        if(!isImageValid.success){
            return res.json(new ApiResponse(400, false, isImageValid.message));
        }
        try {
            deleteProfile(previous.profilePic);
            await StudentModel.findByIdAndUpdate(req.params.id,{ $set : { name, profilePic: profilePic.filename } }, {new : true}).select('-password');
            return res.json(new ApiResponse(200, true, 'Account updated Successfully'));
        } catch (error) {
            deleteProfile(profilePic.filename); // Delete new image if deletion of previous image fails
            return res.json(new ApiResponse(400, false, 'SomeThing went wrong'));
        }

    }

    await StudentModel.findByIdAndUpdate(req.params.id,{ $set : { name } }, {new : true}).select('-password');
    return res.json(new ApiResponse(200, true, 'Account updated Successfully'));
})

function deleteProfile(file_name){
    let FullPath = path.resolve('./public/temp/' + file_name);
    if(existsSync(FullPath)){
        try {
            fs.unlinkSync(FullPath)
            return true
        } catch (error) {
            console.error(`Error deleting file: ${error}`);  
            return false          
        }
    }else{
        console.log(`File not found: ${FullPath}`);
        return false
    }
}

// ***********************************************************************************************************

async function validateImage(profilePic){
    
    if(profilePic.size > 1024 * 1024 * 5){
        deleteProfile(profilePic.filename);
        return {
            success : false, message : 'Image must be less than 5 MB'
        }
    }

    if(profilePic.mimetype.split('/')[0] != 'image'){
        deleteProfile(profilePic.filename);
        return {
            success : false, message : 'Only Images are allowed',
        } 
    }

    return {success : true}
}

// *************************************************************************************************************

export let getUsers = AsyncHandler(async (req,res) =>{
    let resultPerPage = 4;
    let pageNo = req.query.page || 1;
    let skips =  resultPerPage * (pageNo - 1);
    let allUsers = await StudentModel.find({role : 'user'}).limit(resultPerPage).skip(skips);
    let totals = await StudentModel.countDocuments({role : 'user'});
    
    return res.json({    
        statusCode : 200, success:true,message : allUsers , totals, perPage : resultPerPage
    });
})

// *************************************************************************************************************

export let getCurrentUser = AsyncHandler(async (req,res) =>{
    let currentUser = await StudentModel.findById(req.user._id).select('-password');
    if(!currentUser){
        return res.json(new ApiResponse(404, false, 'User not login'));
    }
    return res.json(new ApiResponse(200, true, currentUser))
})

export let getSingleUser = AsyncHandler(async (req,res) =>{
    let user = await StudentModel.findById(req.params.id).select('-password');

    if(!user){
        return res.json(new ApiResponse(404, false, 'User not found'));
    }
    
    return res.json(new ApiResponse(200, true, user))
})