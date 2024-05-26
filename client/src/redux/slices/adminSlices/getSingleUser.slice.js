import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiEndpoint } from "../../../endpoints";



let initialState = {
    isLoading : false, data : null, error : null
}

export let getSingleUser = createAsyncThunk('getSingleUser',  async (id) =>{
        let url = `${apiEndpoint}/student/get/single/${id}`;
        let data =await fetch(url);
        let jData = await data.json();
        return jData; 
})


let SingleUserSlice = createSlice({
    name : 'SingleUserSlice',
    initialState,
    reducers : {},
    extraReducers : (builder) =>{

        builder.addCase(getSingleUser.pending, (state, action) =>{
            state.isLoading = true;
        })
        builder.addCase(getSingleUser.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload
        })
        builder.addCase(getSingleUser.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})

export default SingleUserSlice.reducer