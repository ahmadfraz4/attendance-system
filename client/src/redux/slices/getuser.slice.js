import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiEndpoint } from "../../endpoints";
import axios from "axios";

let initialState = {
    isLoading : false, data : null, error : null
}

export let getUser = createAsyncThunk( 'currentUser',  async () =>{
        let url = `${apiEndpoint}/student/get/current`;
        let data =await axios.get(url);
        return data.data; 
})


let getCurrent = createSlice({
    name : 'getCurrent',
    initialState,
    reducers : {},
    extraReducers : (builder) =>{

        // for current user

        builder.addCase(getUser.pending, (state, action) =>{
            state.isLoading = true;
        })
        builder.addCase(getUser.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload
        })
        builder.addCase(getUser.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})

export default getCurrent.reducer