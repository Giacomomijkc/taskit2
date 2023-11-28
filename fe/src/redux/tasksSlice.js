import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
const apiUrlTasks = `${process.env.REACT_APP_SERVER_BASE_URL}tasks`;

export const fetchTasks = createAsyncThunk('tasks/getTasks', async ({ page, category, urgency, deadline }) =>{
    try {
        const token = JSON.parse(localStorage.getItem("userLoggedIn"));

        let url = `${apiUrlTasks}/?page=${page || 1}&limit=10&sortBy=createdAt&order=desc`;

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
        //gestire bene errori da renderizzare
        if (error.response && error.response.data && error.response.data.message) {
            console.log(error.response.data)
            console.log(error.response.data.error)
            return error.response.data.message
        }
        throw new Error('Error fetching tasks');
    }
})

export const createTask = createAsyncThunk('tasks/createTask', async(taskData)=>{
    try {
        const token = JSON.parse(localStorage.getItem("userLoggedIn"));
        const response = await axios.post(`${apiUrlTasks}/create`, taskData, {
            headers: { 'Authorization': `${token}` }
        });
        console.log(response);
        return response.data
    } catch (error) {
        console.log(error)
        console.error('Error fetching tasks', error);
        throw new Error('Error fetching tasks');
    }
})

export const deleteTask = createAsyncThunk('tasks/deleteTask', async(taskId)=>{
    try {
        const token = JSON.parse(localStorage.getItem("userLoggedIn"));
        const response = await axios.delete(`${apiUrlTasks}/delete/${taskId}`, {
            headers: { 'Authorization': `${token}` }
        });
        console.log(response);
        return response.data
    } catch (error) {
        //gestire renderizzazione errori
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
        tasksError: null,
        task: null,
        errorNewTask: null,
        loadingNewTask: true,
        successMessageNewTask: null,
        loadingDeleteTask: true,
        taskDeleted: null,
        successMessageDeleteTask: null,
        errorMessageDeleteTask: null
    }, reducers:{
    }, extraReducers: (builder) => {
        builder
        .addCase(fetchTasks.pending, (state, action) =>{
            state.tasksLoading = true;
        })
        .addCase(fetchTasks.rejected, (state, action) =>{
            state.tasksLoading = false;
            state.tasksError = action.payload.message
        })
        .addCase(fetchTasks.fulfilled, (state, action) =>{
            state.tasksLoading = false;
            state.tasks = action.payload
        })
        .addCase(createTask.pending, (state, action) =>{
            state.loadingNewTask = true;
        })
        .addCase(createTask.rejected, (state, action) =>{
            state.errorNewTask = action.payload;
            state.loadingNewTask = false
        })
        .addCase(createTask.fulfilled, (state, action) =>{
            state.task = action.payload;
            state.loadingNewTask = false;
            state.successMessageNewTask = action.payload.message
        })
        .addCase(deleteTask.pending, (state, action)=>{
            state.loadingDeleteTask = true;
        })
        .addCase(deleteTask.rejected, (state, action) =>{
            state.loadingDeleteTask = false;
            state.errorMessageDeleteTask = action.payload;
        })
        .addCase(deleteTask.fulfilled, (state, action) =>{
            state.deleteTask = action.payload;
            state.loadingDeleteTask = false;
            state.successMessageDeleteTask = action.payload.message
        })
    }
})

export default tasksSlice.reducer;