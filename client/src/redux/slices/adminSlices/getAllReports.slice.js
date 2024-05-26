import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiEndpoint } from "../../../endpoints";

let initialState = {
    isLoading : false, data : null, error : null
}

export let allReports = createAsyncThunk( 'allReports',  async () =>{
        let url = `${apiEndpoint}/report/get/all`;
        let data =await fetch(url);
        let jData = await data.json();
        return jData; 
})


let allReportSlice = createSlice({
    name : 'allReportSlice',
    initialState,
    reducers : {},
    extraReducers : (builder) =>{

        builder.addCase(allReports.pending, (state, action) =>{
            state.isLoading = true;
        })
        builder.addCase(allReports.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload
        })
        builder.addCase(allReports.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})

export default allReportSlice.reducer