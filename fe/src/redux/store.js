import {configureStore} from '@reduxjs/toolkit';
import userReducer from './usersSlice';
import loginReducer from './loginsSlice';

export const store = configureStore({
    reducer: {
        users: userReducer,
        logins: loginReducer
    },
  });