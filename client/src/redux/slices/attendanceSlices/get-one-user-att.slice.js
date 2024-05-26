import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiEndpoint } from "../../../endpoints";


let initialState = {
    isLoading : false, data : null, error : null
};

export let getOneUserAtt = createAsyncThunk('getOneUserAttendance' ,async ({id, body = {}}) =>{
    let url = `${apiEndpoint}/attendance/get-user-attendance/${id}`;
   
    let response = await fetch(url,{
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(body)
    });
    let jData = await response.json();
    return jData
})


let OneUserAttendances = createSlice({
    name : 'OneUserAttendances',
    initialState,
    reducers : {},
    extraReducers : (builder) =>{
          builder.addCase(getOneUserAtt.pending, (state, action) =>{
            state.isLoading = true;
          })  
          builder.addCase(getOneUserAtt.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload;
          })  
          builder.addCase(getOneUserAtt.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
          })
    }
})

export default OneUserAttendances.reducer