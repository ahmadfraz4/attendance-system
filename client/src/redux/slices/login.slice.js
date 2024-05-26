import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiEndpoint } from "../../endpoints";

let initialState = {
    isLoading : false, data : null, error : null
}

export let registerUser = createAsyncThunk( 'register',  async (data) =>{
    let url = `${apiEndpoint}/student/register`;
    // console.log(data)
    let response = await fetch(url,{
        method : 'POST',
        body : data
    });

    let jData = await response.json();
    console.log(jData)
    return jData;
})

export let addUser = createAsyncThunk( 'add',  async (data) =>{
    let url = `${apiEndpoint}/student/add`;
    // console.log(data)
    let response = await fetch(url,{
        method : 'POST',
        body : data
    });

    let jData = await response.json();
    console.log(jData)
    return jData;
})

export let loginUser = createAsyncThunk('login',  async (data) =>{
    let url = `${apiEndpoint}/student/login`;
    // console.log(data)
    let response = await fetch(url,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({rollNo : data.rollNo, password : data.password})
    });

    let jData = await response.json();
    return jData;
})


export let logoutUser = createAsyncThunk('logout',  async (data) =>{
    let url = `${apiEndpoint}/student/logout`;
    // console.log(data)
    let response = await fetch(url,{
        method : 'POST',
    });

    let jData = await response.json();
    return jData;
})


let createUser = createSlice({
    name : 'createUser',
    initialState,
    reducers : {
        clearLog(state){
            state.data = null, state.error = null;
        }
    },
    extraReducers : (builder) =>{
        builder.addCase(registerUser.pending, (state, action) =>{
            state.isLoading = true;
        })
        builder.addCase(registerUser.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload
        })
        builder.addCase(registerUser.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
        })

        // for login

        builder.addCase(loginUser.pending, (state, action) =>{
            state.isLoading = true;
        })
        builder.addCase(loginUser.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload
        })
        builder.addCase(loginUser.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
        })
        // for adding

        builder.addCase(addUser.pending, (state, action) =>{
            state.isLoading = true;
        })
        builder.addCase(addUser.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload
        })
        builder.addCase(addUser.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
        })

        // for logout

        builder.addCase(logoutUser.pending, (state, action) =>{
            state.isLoading = true;
        })
        builder.addCase(logoutUser.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.data = action.payload
        })
        builder.addCase(logoutUser.rejected, (state, action) =>{
            state.isLoading = false;
            state.error = action.payload;
        })


    }
})

export const {clearLog}  = createUser.actions
export default createUser.reducer