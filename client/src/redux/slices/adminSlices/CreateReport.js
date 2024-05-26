import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiEndpoint } from "../../../endpoints";

let initialState = {
    isLoading : false, data : null, isCreated : false, error : null
}

export let CreateReport = createAsyncThunk( 'CreateReport',  async ({id, body}) =>{
        let url = `${apiEndpoint}/report/create/${id}`;
        let data =await fetch(url,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify(body)
        });
        let jData = await data.json();
        return jData; 
})


let CreateReportSlice = createSlice({
    name : 'CreateReportSlice',
    initialState,
    reducers : {
        clearRep(state) {
            state.isCreated = false;
            state.data = null;
        }
    },
    extraReducers : (builder) =>{

        builder.addCase(CreateReport.pending, (state, action) =>{
            state.isLoading = true;
        })
        builder.addCase(CreateReport.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload;
            state.isCreated = true
        })
        builder.addCase(CreateReport.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
            state.isCreated = false
        })
    }
})
export const {clearRep} = CreateReportSlice.actions;
export default CreateReportSlice.reducer