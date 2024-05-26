import { configureStore } from "@reduxjs/toolkit";
import  allUsersSlice  from "../slices/allUser.slice";
import getCurrent from '../slices/getuser.slice'
import createUser from '../slices/login.slice'
import userActions from "../slices/user-actions.slice";
import AttendanceMark from '../slices/attendanceSlices/mark.slice'
import OneUserAttendances from '../slices/attendanceSlices/get-one-user-att.slice'
import getMyRequestSlice from '../slices/requestSlice/get-myRequest';
import sendRequest from "../slices/requestSlice/sendRequest";
import getAllRequestSlice from "../slices/adminSlices/getAllRequest.slice";
import ApplicationSlice from "../slices/adminSlices/getApplication.slice";
import ApprovalSlice from "../slices/adminSlices/Approval.slice";
import getSingleUserSlice from "../slices/adminSlices/getSingleUser.slice";
import CreateReportSlice from "../slices/adminSlices/CreateReport";
import allReportSlice from "../slices/adminSlices/getAllReports.slice";
import oneReportSlice from "../slices/adminSlices/UserReport.slice";
import deleteReportSlice from "../slices/adminSlices/deleteReport.slice";
import pageSlice from "../slices/adminSlices/pageSlice";

let store = configureStore({
    reducer: {
        allUsers : allUsersSlice,
        getUser : getCurrent,
        logedInUser : createUser,
        userActions,AttendanceMark, OneUserAttendances, sendRequest, getMyRequestSlice,getAllRequestSlice, ApplicationSlice,
        ApprovalSlice,
        singleUser : getSingleUserSlice,
        createReport : CreateReportSlice,
        allReports : allReportSlice,
        oneReport : oneReportSlice,
        deleteReport : deleteReportSlice,
        pageSlice
      },
})

export default store