import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
const apiUrlTasks = `${process.env.REACT_APP_SERVER_BASE_URL}tasks`;

export const fetchTasks = createAsyncThunk('tasks/getTasks', async () =>{
    try {
        const token = JSON.parse(localStorage.getItem("userLoggedIn"));
        let args = {};
        const { page, limit, sortBy, order, urgency, category, deadline } = args;

        let url = `${apiUrlTasks}/?page=${page || 1}&limit=${limit || 10}&sortBy=${sortBy || 'createdAt'}&order=${order || 'desc'}`;

        if (urgency) {
            url += `&urgency=${urgency}`;
        }
        if (category) {
            url += `&category=${category}`;
        }
        if (deadline) {
            url += `&deadline=${deadline}`;
        }
        
        const response = await axios.get(url, {
            headers: { 'Authorization': `${token}` }
          });
        console.log('response:',response);
        return response.data

    } catch (error) {

        console.log(error)
        console.error('Error fetching tasks', error);
        throw new Error('Error fetching tasks');

    }
})

const tasksSlice = createSlice({
    name:'tasks',
    initialState:{
        tasks: null,
        tasksLoading: true,
        tasksError: null
    }, reducers:{
    }, extraReducers: (builder) => {
        builder
        .addCase(fetchTasks.pending, (state, action) =>{
            state.tasksLoading = true;
        })
        .addCase(fetchTasks.rejected, (state, action) =>{
            state.tasksLoading = false;
            state.tasksError = action.payload
        })
        .addCase(fetchTasks.fulfilled, (state, action) =>{
            state.tasksLoading = false;
            state.tasks = action.payload
        })
    }
})

export default tasksSlice.reducer;