import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
const apiUrlLogin = `${process.env.REACT_APP_SERVER_BASE_URL}login`;

export const login = createAsyncThunk('logins/login', async(loginData, {rejectWithValue})=> {
    try {
        const response = await axios.post(apiUrlLogin, loginData);
        const {data} = response;
        localStorage.setItem('userLoggedIn', JSON.stringify(data.token));
        return data
    } catch (error) {
        console.log(error)
        console.log('sono qui')
          if (error.response && error.response.data && error.response.data.message) {
            console.log(error.response.data)
            console.log(error.response.data.error)
            return rejectWithValue(error.response.data.message)
          } else {
            console.log(error)
              throw error;
          }
    }
})

const loginsSlice = createSlice({
    name:'logins',
    initialState:{
        isLloading: true,
        error: null,
        successMessage: null,
        userId: null,
        isLogged: false
    }, reducers:{

    }, extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state, action) =>{
            state.isLloading = true;
        })
        .addCase(login.rejected, (state, action) => {
            state.isLloading = false;
            state.error = action.payload
        })
        .addCase(login.fulfilled, (state, action) =>{
            state.successMessage = action.payload.message;
            state.isLloading = false;
            state.isLogged = true;
            
            const token = localStorage.getItem('userLoggedIn');
            const decodedToken = jwtDecode(token);
            
            state.userId = decodedToken._id
        })
    }
})

export default loginsSlice.reducer;