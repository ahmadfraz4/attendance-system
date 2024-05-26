import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiEndpoint } from "../../../endpoints";


let initialState = {
    isLoading : false, data : null, error : null
};

export let markAttendance = createAsyncThunk('markAttendance' ,async ({id, isPresent}) =>{
    let url = `${apiEndpoint}/attendance/mark/${id}`;
    let response = await fetch(url,{
        method : 'PUT',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify({isPresent : isPresent})
    });
    console.log(isPresent)
    let jData = await response.json();
    console.log(jData)
    return jData
})



let AttendanceMark = createSlice({
    name : 'AttendanceMark',
    initialState,
    reducers: {
      clearData(state) {
          state.data = null;
        },
     },
    extraReducers : (builder) =>{
          builder.addCase(markAttendance.pending, (state, action) =>{
            state.isLoading = true;
          })  
          builder.addCase(markAttendance.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload;
          })  
          builder.addCase(markAttendance.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
          })
    }
})
export const { clearData } = AttendanceMark.actions;
export default AttendanceMark.reducer