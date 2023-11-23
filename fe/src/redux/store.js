import {configureStore} from '@reduxjs/toolkit';
import userReducer from './usersSlice';
import loginReducer from './loginsSlice';
import taskReducer from './tasksSlice';

export const store = configureStore({
    reducer: {
        users: userReducer,
        logins: loginReducer,
        tasks: taskReducer
    },
  });