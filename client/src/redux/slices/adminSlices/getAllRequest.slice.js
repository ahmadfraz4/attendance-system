import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiEndpoint } from "../../../endpoints";

let initialState = {
    isLoading : false, data : null, error : null
}

export let allRequests = createAsyncThunk( 'allRequests',  async () =>{
        let url = `${apiEndpoint}/report/get-all-request`;
        let data =await fetch(url);
        let jData = await data.json();
        return jData; 
})


let allRequestSlice = createSlice({
    name : 'allRequestSlice',
    initialState,
    reducers : {},
    extraReducers : (builder) =>{

        builder.addCase(allRequests.pending, (state, action) =>{
            state.isLoading = true;
        })
        builder.addCase(allRequests.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload
        })
        builder.addCase(allRequests.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})

export default allRequestSlice.reducer