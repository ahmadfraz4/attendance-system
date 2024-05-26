import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiEndpoint } from "../../../endpoints";


let initialState = {
    isLoading : false, data : null, error : null
}

export let Approval = createAsyncThunk('Approval',  async ({id, approval}) =>{
        let url = `${apiEndpoint}/report/aproveRequest/${id}`;
        let data =await fetch(url,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({approval : approval})
        });
        console.log(approval)
        let jData = await data.json();
        return jData; 
})


let ApprovalSlice = createSlice({
    name : 'ApprovalSlice',
    initialState,
    reducers : {
        clearApp(state) {
            state.data = null;
        },
    },
    extraReducers : (builder) =>{

        builder.addCase(Approval.pending, (state, action) =>{
            state.isLoading = true;
        })
        builder.addCase(Approval.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload
        })
        builder.addCase(Approval.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})
export const {clearApp} = ApprovalSlice.actions;
export default ApprovalSlice.reducer