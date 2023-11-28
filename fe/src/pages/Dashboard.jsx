import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../redux/tasksSlice';
import Task from '../components/Task';
import TasksContainer from '../components/TasksContainer';

const Dashboard = () => {
  
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.tasks?.tasks);
  const tasksLoading = useSelector(state => state.tasks.tasks?.tasksLoading);
  const tasksError = useSelector(state => state.tasks.tasks?.tasksError);


  return (
    <>
    <NavigationBar/>
      <div className='flex flex-col flex-wrap items-center sm:flex-row sm:justify-evenly sm:items-center py-5 px-'>
          <TasksContainer/>
      </div>
    </>
  )
}

export default Dashboard