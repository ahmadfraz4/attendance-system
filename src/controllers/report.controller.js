import { AttendanceModel } from "../models/attendance.model.js";
import { ReportModel } from "../models/reports.model.js";
import { RequestModel } from "../models/request.model.js";
import { StudentModel } from "../models/student.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { getDifference } from "./attendance.controller.js";

export let createReport = AsyncHandler(async (req,res) =>{
    let {fromDate, toDate, report, reportName} = req.body;
    let endDate = new Date(Date.now()).setHours(23, 59, 59, 999);

    if(new Date(toDate) > endDate){
        return res.json(new ApiResponse(400, false, 'End Date is not valid'));
    }

    let user = await StudentModel.findById(req.params.id);
    if(!user){
        return res.json(new ApiResponse(404, false, "user not found"))
    }

    let attendance = await AttendanceModel.find(
        {user : req.params.id, date : {$gte : new Date(fromDate).setHours(0,0,0,0), $lte : new Date(toDate).setHours(23, 59, 59, 999)}}
    );
    let differ =  Math.floor(getDifference(new Date(fromDate).setHours(0,0,0,0), new Date(toDate).setHours(23, 59, 59, 999), res ) );
    differ = differ == 0 ? 1 : differ

    let att_count = 0;
    let attArr = [];
    
    let prev = new Date(fromDate).setHours(0, 0, 0, 0);
    let next = new Date(toDate).setHours(0, 0, 0, 0);
    let dateRange = [];
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    for (let index = prev; index <= next; index += 24 * 60 * 60 * 1000) {
        let currentDate = new Date(index);
        let day = currentDate.getDate();
        let month = monthNames[currentDate.getMonth()];
        let year = currentDate.getFullYear();
        
        let formattedDate = `${day}-${month}-${year}`;
        dateRange.push(formattedDate);
    }
    

    dateRange.forEach(dt => {
        let found = false;
        
        attendance.forEach(item => {
            if (new Date(item.date).setHours(0, 0, 0, 0) === new Date(dt).setHours(0, 0, 0, 0)) {
                if (item.isPresent) {
                    att_count += 1;
                    attArr.push({ date  :  new Date(dt).setHours(0, 0, 0, 0) , label : 'p'});
                    found = true;
                }
            }
        });
    
        if (!found) {
            attArr.push({ date  :  new Date(dt).setHours(0, 0, 0, 0) , label : 'a'});
        }
    });


    let totalAvg = ((att_count / differ) * 100).toFixed(2);
    let create = await ReportModel.create({
       user : req.params.id , fromDate, toDate, ...(report ? { report } : {}), attendancePercentage : totalAvg, reportName, statics : attArr
    });
    return res.json(new ApiResponse(200, true, create));
})


export let getReport = AsyncHandler(async (req, res) =>{
    let reportData  = await ReportModel.findById(req.params.id).populate('user', '-password');
    
    if(!reportData){
        return res.json(new ApiResponse(404, false, "Report Not Found"));
    }

    return res.json(new ApiResponse(200, true, reportData));
})

export let getAllReports = AsyncHandler(async (req, res) =>{
    let reportData  = await ReportModel.find().populate('user', '-password');
    
    if(!reportData){
        return res.json(new ApiResponse(404, false, "Report Not Found"));
    }

    return res.json(new ApiResponse(200, true, reportData));
})


export let checkName = AsyncHandler(async (req, res) =>{
    let reportData  = await ReportModel.find({reportName : req.body.name });
  
    if(reportData.length > 0){
        return res.json(new ApiResponse(400, false, "Report name already taken"));
    }

    return res.json(new ApiResponse(200, true, 'Report name available'));
})

export let getByName = AsyncHandler(async (req, res) =>{
    let reportData  = await ReportModel.find({reportName : {$regex : req.body.name, $options : 'i' }});

    if(!reportData){
        return res.json(new ApiResponse(404, false, "Report Not Found"));
    }

    return res.json(new ApiResponse(200, true, reportData));
})

export let requestToLeave = AsyncHandler(async (req,res) =>{
    let {application, leaveDates} = req.body;
    let user = await StudentModel.findById(req.user.id);
    // console.log(leaveDates);

    let datesArr = leaveDates.map(item =>{
        return new Date(item)
    })
    if(!user){
        return res.json(new ApiResponse(404, false, "User not found"));
    }
    
    await RequestModel.create({
        user : req.user._id,
        application, leaveDates : datesArr
    });

    return res.json(new ApiResponse(200, true, 'application waiting for approval'));
})

export let aproveRequest = AsyncHandler(async(req,res) =>{
    let requestId = req.params.id;
    let {approval} = req.body;
    let request = await RequestModel.findById(requestId).populate('user', '-password');

    if(!request){
        return res.json(new ApiResponse(404, false, 'request not found'))
    }

    if(approval == 'approved'){
        request.leaveDates.forEach(async (item) =>{
            await AttendanceModel.create({
                user : request.user, isPresent : true, marked : true, date : item,
            });        
        })
    }

    request.approval = approval;
    await request.save({validateBeforeSave : false});
    return res.json(new ApiResponse(200, true, approval))
})

export let myRequest = AsyncHandler(async (req,res) =>{
    let requests = await RequestModel.find({user : req.user._id});
    if(!requests){
        return new ApiResponse(404, false, 'No Leave Requests')
    }
    return res.json(new ApiResponse(200, true, requests));
})

export let allRequest = AsyncHandler(async (req,res) =>{
    let requests = await RequestModel.find({approval : 'pending'}).populate('user', '-password');
    if(!requests){
        return new ApiResponse(404, false, 'No Leave Requests')
    }
    return res.json(new ApiResponse(200, true, requests));
})

export let getApplication = AsyncHandler(async (req,res) =>{
    let application = await RequestModel.findById(req.params.id).populate('user', '-password');
    if(!application){
        return res.json(new ApiResponse(404, false, 'application not found'))
    }
    return res.json(new ApiResponse(200, true, application));
})

export let deleteReport = AsyncHandler(async (req,res) =>{
    let isDeleted = await ReportModel.findByIdAndDelete(req.params.id);
    if(!isDeleted){
        return res.json(new ApiResponse( 400,false, 'Something went wrong Try again later'))
    }
    return res.json(new ApiResponse(200, true, 'Report Deleted Successfully'))
})

