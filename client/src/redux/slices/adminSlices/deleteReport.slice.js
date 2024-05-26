import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiEndpoint } from "../../../endpoints";

let initialState = {
    isLoading : false,  error : null, isDeleted : false, data : null
};


export let deleteReport = createAsyncThunk('deleteReport' ,async (id) =>{
    let url = `${apiEndpoint}/report/delete-report/${id}`;
    let response = await fetch(url, {
        method : 'DELETE'
    });
    let jData = await response.json();
    return jData
})


let DeleteReportSlice = createSlice({
    name : 'DeleteReportSlice',
    initialState,
    reducers : {
      clearAction(state) {
        state.isDeleted = null; state.data = null
      }
    },
    extraReducers : (builder) =>{
         
        //   delete
          builder.addCase(deleteReport.pending, (state, action) =>{
            state.isLoading = true;
          })  
          builder.addCase(deleteReport.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload;
            state.isDeleted = true;
          })  
          builder.addCase(deleteReport.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
          })
    }
})

export const {clearAction} = DeleteReportSlice.actions;
export default DeleteReportSlice.reducer