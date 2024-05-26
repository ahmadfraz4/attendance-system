import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiEndpoint } from "../../../endpoints";


let initialState = {
    isLoading : false, data : null, error : null
}

export let getApplication = createAsyncThunk( 'getApplication',  async (id) =>{
        let url = `${apiEndpoint}/report/getApplication/${id}`;
        let data =await fetch(url);
        let jData = await data.json();
        return jData; 
})


let ApplicationSlice = createSlice({
    name : 'ApplicationSlice',
    initialState,
    reducers : {},
    extraReducers : (builder) =>{

        builder.addCase(getApplication.pending, (state, action) =>{
            state.isLoading = true;
        })
        builder.addCase(getApplication.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload
        })
        builder.addCase(getApplication.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})

export default ApplicationSlice.reducer