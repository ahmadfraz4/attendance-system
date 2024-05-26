import { AttendanceModel } from "../models/attendance.model.js";
import { StudentModel } from "../models/student.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import cron, { validate } from 'node-cron'



export let MarkAttendance = AsyncHandler(async(req,res) => {
    let today  = new Date(Date.now());
    let localTime = today
    let {isPresent, attendance_id}  = req.body;
    let studentId = req.params.id;
    let user = await StudentModel.findById(req.params.id);

    if(!user){
        return res.json(new ApiResponse(400, false, "user not exist"));
    }

    let canMarkAttendance = await AttendanceModel.canMarkAttendance(studentId, localTime);

    if(user.role != 'admin'){
        if(studentId != req.user._id){
            return res.json(new ApiResponse(401, false, 'Unauthorize User'));
        }
    }

    if(!canMarkAttendance){
        return res.json(new ApiResponse(400, false, 'Attendance already marked for today.'))
    }

    let presents_count = 0;
    let day_difference = Math.floor(getDifference(new Date(user.joinAt).setHours(0,0,0,0), new Date(Date.now()), res ));
    day_difference = day_difference == 0 ? 1 : day_difference

    let find_attendace_of_user = await AttendanceModel.find({user : req.params.id});
    find_attendace_of_user.forEach((item, index) =>{
        if(item.isPresent && new Date(item?.date).getDay() != 0 ){
            presents_count += 1;
        }
    })

    let attendancePercentage = ((presents_count / day_difference ) * 100).toFixed(2);
    

    // let Updated = await AttendanceModel.findByIdAndUpdate(attendance_id , {$set : {
    //     user : studentId, isPresent : isPresent, date : localTime, marked : true, AttendacePercentage : attendancePercentage
    // }}, {new : true});
    
    // if(!Updated){
        await AttendanceModel.create({
            user : studentId, isPresent : isPresent, date : localTime, marked : true, AttendacePercentage : attendancePercentage
        })
    // }
   
    user.AttendacePercentage = attendancePercentage;
    await user.save({validateBeforeSave:false});

    return res.json(new ApiResponse(200, true, "Attendance Marked Successfully"))
})

// percentage of attendance of user
export let ReportUserAttendance = AsyncHandler(async (req,res) =>{
    let user = await StudentModel.findById(req.params.id).select('-password');

    if(!user){
        return res.json(new ApiResponse(404, false, 'users not found'));
    }
    if(req.user.role != 'admin'){
        if(req.user._id != req.params.id){
          return res.json(new ApiResponse(401, false, "Unautorize user"));
        }
    }
    let presents_count = 0;
    let day_difference = Math.floor(getDifference(new Date(user.joinAt).setHours(0,0,0,0), new Date(Date.now()), res ) )
    day_difference = day_difference == 0 ? 1 : day_difference

    let user_attendance = await AttendanceModel.find({user : req.params.id});
    user_attendance.forEach((item,index) =>{
        if(item.isPresent && new Date(item?.date).getDay() != 0 ){
            presents_count += 1;
        }
    });

    let attendancePercentage = ((presents_count / day_difference) * 100).toFixed(2);
    user.AttendacePercentage = attendancePercentage;
    await user.save({validateBeforeSave:false});
    return res.json(new ApiResponse(200, true, user));
})

export function getDifference(start_date, end_date, res =''){
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (startDate > endDate) {
        return 
    }
    let currentDate = new Date(startDate);
    let totalDays = 0;
    let sundayCount = 0;
    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getUTCDay(); // it will get days 0-6
        if (dayOfWeek === 0) {
            sundayCount++;
        }
        totalDays++;
        currentDate.setUTCDate(currentDate.getUTCDate() + 1); // increasing the date
    }
    const daysExcludingSundays = totalDays - sundayCount;
    return daysExcludingSundays;
}


// ***********************************************************************************************************

// get all attendance
export let getAttendance = AsyncHandler(async (req,res) =>{
    let attendance = await AttendanceModel.find().populate('user', '-password');
    res.json(new ApiResponse(200, true, attendance));
})

// ***********************************************************************************************************

// fromTo day && single date, Multiple users data // Only for admin
export let fromDaytoDay = AsyncHandler(async (req, res) =>{
    let {fromDay, toDay, date} = req.body;
    
    let getAllData;
    if(date){
        let oneSpecificDate = new Date(date);
        getAllData = await AttendanceModel.find({
            date : {$gte : oneSpecificDate.setHours(0,0,0,0), $lte : oneSpecificDate.setHours(23, 59, 59, 999)}
        }).populate('user', '-password')
    }else if(fromDay && toDay) {
        let start_day = new Date(fromDay).setHours(0,0,0,0);
        let end_day = new Date(toDay).setHours(23, 59, 59, 999);

        
         getAllData = await AttendanceModel.find({
            date : {$gte : start_day, $lte : end_day}
        }).populate('user', '-password')
    }
    return res.json(new ApiResponse(200, true, getAllData));

}) 

// ***********************************************************************************************************

// one user data, one date && fromTo date , admin and specific user can access
export let getAttendanceOfOneUser = AsyncHandler(async (req,res) =>{
    let user = await StudentModel.findById(req.params.id);
    let {date, fromDate, tillDate} = req.body;

    if(req.user.role != 'admin'){
        if(req.params.id != req.user._id){
            return res.json(new ApiResponse(401, false, 'UnAuthorized User'));
        }
    }
    let getUserAttendance;
    if(date){
        getUserAttendance = await AttendanceModel.find({user : req.params.id, date : {$gte : new Date(date).setHours(0,0,0,0), $lte : new Date(date).setHours(23, 59, 59, 999)   } }  ).populate('user', '-password');
        
        return res.json(new ApiResponse(200, true, getUserAttendance));
   
    }else if(fromDate && tillDate){
        getUserAttendance = await AttendanceModel.find({user : req.params.id, date : { $gte : new Date(fromDate).setHours(0,0,0,0), $lte : new Date(tillDate).setHours(23, 59, 59, 999) } }  ).populate('user', '-password');
        let presents_count = 0;
        let day_difference = Math.floor(getDifference(new Date(fromDate).setHours(0,0,0,0), new Date(tillDate).setHours(23,59,59,999), res ))
        day_difference = day_difference == 0 ? 1 : day_difference;

        let user_attendance = await AttendanceModel.find({user : req.params.id, date  : {$gte : new Date(fromDate).setHours(0,0,0,0), $lte : new Date(tillDate).setHours(23,59,59,999)}});
        user_attendance.forEach((item,index) =>{
            if(item.isPresent && new Date(item?.date).getDay() != 0 ){

                presents_count += 1;
            }
        });
        let attendancePercentage = ((presents_count / day_difference) * 100).toFixed(2);
        
        return res.json({
            statusbar : 200,
            success : true,
            message : getUserAttendance, attendancePercentage
        });

    }else{
        getUserAttendance = await AttendanceModel.find({user : req.params.id}).populate('user', '-password');

        let presents_count = 0;
        let day_difference = Math.floor(getDifference(new Date(user.joinAt).setHours(0,0,0,0), new Date(Date.now()), res ))
        day_difference = day_difference == 0 ? 1 : day_difference

        let user_attendance = await AttendanceModel.find({user : req.params.id, date  : {$gte : new Date(user.joinAt).setHours(0,0,0,0), $lte : new Date(Date.now())}});
        user_attendance.forEach((item,index) =>{
            if(item.isPresent && new Date(item?.date).getDay() != 0 ){
                presents_count += 1;
            }
        });
        let attendancePercentage = ((presents_count / day_difference) * 100).toFixed(2);
         user.AttendacePercentage = attendancePercentage;
         user.save({validateBeforeSave : false});

        return res.json({
            statusbar : 200,
            success : true,
            message : getUserAttendance, attendancePercentage
        });
    }
   

})


// get all attendances of one user
// Admin and user

export let getUserAllAttendances = AsyncHandler(async (req,res) =>{
    let user = await StudentModel.findById(req.params.id).select('-password');
    if(!user){
        return res.json(new ApiResponse(400, false, 'User not exist'));
    }
    if(req.user.role != 'admin'){
        if(req.user._id != req.params.id){
            return res.json(new ApiResponse(401, false, 'Unautorized user'));
        }
    }
    let attendances = await AttendanceModel.find({user : req.params.id}).populate('user', '-password');
    // console.log(attendances);
    return res.json(new ApiResponse(200, true, attendances));

})


// ***********************************************************************************************************
// const userIds = [
//     '6651751866d41d0c638681cb',
//     '665175c366d41d0c638681d8',
//     '665175d966d41d0c638681df',
//     '66517778151825f51b7ccf86',
//     '66517789151825f51b7ccf8d',
//     '66517798151825f51b7ccf94',
//   ];

// async function generateAttendanceData() {
//     const startDate = new Date('2024-04-25');
//     const endDate = new Date('2024-05-20');
//     const millisecondsPerDay = 24 * 60 * 60 * 1000;
  
//     // Loop through each date
//     for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
//       // Loop through each user
//       for (let userId of userIds) {
//         // Generate random attendance data
//         const randomIsPresent = Math.random() < 0.7; // 70% chance of being present
//         const attendance = new AttendanceModel({
//           user: userId,
//           isPresent: randomIsPresent,
//           date: new Date(currentDate),
//         });
  
//         // Save to MongoDB
//         await attendance.save();
//       }
//     }
  
//     console.log('Random attendance data generated successfully.');
//   }
  
//   // Call the function to generate data
//   generateAttendanceData();
