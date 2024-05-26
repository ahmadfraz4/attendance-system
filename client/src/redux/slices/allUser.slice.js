import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiEndpoint } from '../../endpoints';


const initialState = {
  isLoading : false,
  data : null,
  error : null
}

export let getAllUsers = createAsyncThunk('getAllUsers', async (page) =>{
   try {
    let url = `${apiEndpoint}/student/get?page=${page}`;
    let response = await fetch(url);
    let data =await response.json();
    return data; 
   } catch (error) {
    return error
   }
})




export const allUsersSlice = createSlice({
  name: 'allUsers',
  initialState,
  reducers: {},

  extraReducers : (builder) => {
    builder.addCase(getAllUsers.fulfilled, (state, action) =>{
        state.isLoading = false;
        state.data = action.payload;
    })
    builder.addCase(getAllUsers.pending, (state, action) =>{
        state.isLoading = true;
    })
    builder.addCase(getAllUsers.rejected, (state, action)=>{
        state.isLoading = false;
        state.error = action.payload
    })

  }
})


export default allUsersSlice.reducer