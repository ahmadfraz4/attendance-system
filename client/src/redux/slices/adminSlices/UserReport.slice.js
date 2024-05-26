import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiEndpoint } from "../../../endpoints";

let initialState = {
    isLoading : false, data : null, error : null
}

export let oneReport = createAsyncThunk( 'oneReport',  async (id) =>{
        let url = `${apiEndpoint}/report/get/${id}`;
        let data =await fetch(url,{
            method : 'POST'
        });
        let jData = await data.json();
        return jData; 
})


let oneReportSlice = createSlice({
    name : 'oneReportSlice',
    initialState,
    reducers : {},
    extraReducers : (builder) =>{

        builder.addCase(oneReport.pending, (state, action) =>{
            state.isLoading = true;
        })
        builder.addCase(oneReport.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload
        })
        builder.addCase(oneReport.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})

export default oneReportSlice.reducer