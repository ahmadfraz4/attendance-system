import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiEndpoint } from "../../../endpoints";



let initialState = {
    isLoading : false, data : null, error : null
};

export let makeRequest = createAsyncThunk('makeRequest' ,async (body) =>{
    let url = `${apiEndpoint}/report/leave-request`;
   
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


let sendRequest = createSlice({
    name : 'sendRequest',
    initialState,
    reducers : {
        clearData(state) {
            state.data = null;
        },
    },
    extraReducers : (builder) =>{
          builder.addCase(makeRequest.pending, (state, action) =>{
            state.isLoading = true;
          })  
          builder.addCase(makeRequest.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload;
          })  
          builder.addCase(makeRequest.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
          })
    }
})

export const {clearData} = sendRequest.actions;
export default sendRequest.reducer