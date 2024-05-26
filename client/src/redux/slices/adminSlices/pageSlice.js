import { createSlice } from "@reduxjs/toolkit"

let initialState = {
    page : 1
}

let PageSlice = createSlice({
    name : 'pageSlice',
    initialState ,
    reducers : {
        pageNo (state, action) {
            state.page = action.payload;
        }
    }

})


export const {pageNo} = PageSlice.actions;
export default PageSlice.reducer