import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiEndpoint } from "../../endpoints";

let initialState = {
    isLoading : false, isUpdated : false, error : null, isDeleted : false
};

export let updateUser = createAsyncThunk('updateUser' ,async ({id, data}) =>{
    let url = `${apiEndpoint}/student/update/${id}`;
    let response = await fetch(url,{
        method : 'PUT',
        body : data
    });
    let jData = await response.json();
    return jData
})
export let deleteUser = createAsyncThunk('deleteUser' ,async (id) =>{
    let url = `${apiEndpoint}/student/delete/${id}`;
    let response = await fetch(url, {
        method : 'DELETE'
    });
    let jData = await response.json();
    return jData
})


let userActions = createSlice({
    name : 'userActions',
    initialState,
    reducers : {
      clearAction(state) {
        state.isUpdated = null; state.isDeleted = null
      }
    },
    extraReducers : (builder) =>{
          builder.addCase(updateUser.pending, (state, action) =>{
            state.isLoading = true;
          })  
          builder.addCase(updateUser.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isUpdated = true;
            state.isDeleted = false;
          })  
          builder.addCase(updateUser.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
          })
        //   delete
          builder.addCase(deleteUser.pending, (state, action) =>{
            state.isLoading = true;
          })  
          builder.addCase(deleteUser.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isUpdated = false;
            state.isDeleted = true;
          })  
          builder.addCase(deleteUser.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
          })
    }
})

export const {clearAction} = userActions.actions;
export default userActions.reducer