import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiEndpoint } from "../../../endpoints";



let initialState = {
    isLoading : false, data : null, error : null
};

export let GetMyRequest = createAsyncThunk('GetMyRequest' ,async () =>{
    let url = `${apiEndpoint}/report/get-my-request`;
   
    let response = await fetch(url);

    let jData = await response.json();
    return jData
})


let getMyRequestSlice = createSlice({
    name : 'getMyRequestSlice',
    initialState,
    reducers : {},
    extraReducers : (builder) =>{
          builder.addCase(GetMyRequest.pending, (state, action) =>{
            state.isLoading = true;
          })  
          builder.addCase(GetMyRequest.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload;
          })  
          builder.addCase(GetMyRequest.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
          })
    }
})

export default getMyRequestSlice.reducer