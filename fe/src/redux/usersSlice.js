import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
const apiUrlUploadAvatar = `${process.env.REACT_APP_SERVER_BASE_URL}users/cloudUpload`;
const apiUrlRegisterUser = `${process.env.REACT_APP_SERVER_BASE_URL}users/create`;
const apiUrlUsers = `${process.env.REACT_APP_SERVER_BASE_URL}users/`;

export const uploadAvatar = createAsyncThunk('users/uploadAvatar', async (avatarFormData) => {
    try {
        const response = await axios.post(apiUrlUploadAvatar, avatarFormData);
        console.log(response)
        return response.data.avatar;
    } catch (error) {
        console.log(error)
        throw new Error('Errore durante l\'upload dell\'avatar');
    }
});

export const registerUser = createAsyncThunk('users/registerUser', async (userData, { rejectWithValue }) => {
  try {
      const response = await axios.post(apiUrlRegisterUser, userData);
      console.log(response.data)
      return response.data;
  } catch (error) {
    console.log(error)
    console.log('sono qui')
      if (error.response && error.response.data && error.response.data.message) {
        console.log(error.response.data)
        console.log(error.response.data.error)
        return rejectWithValue(error.response.data.message)
      } /*else if (
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error.errors &&
        error.response.data.error.errors.nickname &&
        error.response.data.error.errors.nickname.message
      ) {
        console.log('Errore middleware:nickname');
        console.log(error.response.data.error)
        return rejectWithValue(error.response.data.error.errors.nickname.message);
      } else if (  
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error.errors &&
        error.response.data.error.errors.email &&
        error.response.data.error.errors.email.message) {
        console.log(error.response.data.error)
        console.log('Errore middleware:email');
        return rejectWithValue(error.response.data.error.errors.email.message);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error.errors &&
        error.response.data.error.errors.password &&
        error.response.data.error.errors.password.message
      ) {
        console.log(error.response.data.error)
        console.log('Errore middleware:password');
        return rejectWithValue(error.response.data.error.errors.password.message);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error.errors &&
        error.response.data.error.errors.avatar &&
        error.response.data.error.errors.avatar.message
      ) {
        console.log(error.response.data.error)
        console.log('Errore middleware:avatar');
        return rejectWithValue(error.response.data.error.errors.avatar.message);
      }*/
      else if (error.response && error.response.data && error.response.data.errors) {
        console.log('middlewareee!!')
        let errorMessage = '';
  
        for (const errorItem of error.response.data.errors) {
          errorMessage += errorItem.msg + '\n';
        }
  
        return rejectWithValue(errorMessage);
      }
      else {
        console.log(error)
          throw error;
      }
      //console.log(error)
  }
});

export const loggedUserById = createAsyncThunk('users/loggedUserById', async (userId) =>{
  //const token = localStorage.getItem('userLoggedIn');
  //const decodedToken = jwtDecode(token);

  try {
    const token = JSON.parse(localStorage.getItem("userLoggedIn"));
    const response = await axios.get(`${apiUrlUsers}${userId}`, {
      headers: { 'Authorization': `${token}` }
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.log(error)
    console.error('Errore durante il recupero dei dati dello user', error);
    throw new Error('Errore durante il recupero dei dati dello user');
  }

})


export const verifyUser = createAsyncThunk('users/verifyUser', async (token) =>{
  try {
    const response = await axios.get(`${apiUrlUsers}verify?token=${token}`);
    console.log(response)
    return response.data
  } catch (error) {
    console.log(error)
    console.error('Errore durante il recupero dei dati dello user', error);
    throw new Error('Errore durante il recupero dei dati dello user');
  }
})

const usersSlice = createSlice({
    name: 'users',
    initialState: {
      avatarURL: null,
      successMessage: null,
      isUploadLoading: true,
      user: null,
      error: null,
      userLogged: null,
      isUserLogging: true,
      errorUserLogged: null,
      userVerify: null,
      isVerifing: true,
      errorVerify: null
    },
    reducers: {
    },
    extraReducers: (builder) => {
      builder
        .addCase(uploadAvatar.pending, (state, action) => {
          state.isUploadLoading = true;
        })
        .addCase(uploadAvatar.fulfilled, (state, action) => {
          state.avatarURL = action.payload;
          state.isUploadLoading = false;
        })
        .addCase(uploadAvatar.rejected, (state, action) => {
          state.isUploadLoading = false;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          state.user = action.payload;
          state.successMessage = action.payload.message;
        })
        .addCase(registerUser.rejected, (state, action) => {
          state.error = action.payload;
        })
        .addCase(loggedUserById.fulfilled, (state, action) =>{
          state.userLogged = action.payload;
          state.isUserLogging = false
        })
        .addCase(loggedUserById.rejected, (state, action) =>{
          state.errorUserLogged = action.payload;
          state.isUserLogging = false
        })
        .addCase(loggedUserById.pending, (state, action) =>{
          state.isUserLogging = true
        })
        .addCase(verifyUser.fulfilled, (state, action) =>{
          state.userVerify = action.payload;
          state.isVerifing = false
        })
        .addCase(verifyUser.rejected, (state, action) =>{
          state.errorVerify = action.payload;
          state.isVerifing = false
        })
        .addCase(verifyUser.pending, (state, action) =>{
          state.isVerifing = true
        })
    },
  });
  
  export default usersSlice.reducer;