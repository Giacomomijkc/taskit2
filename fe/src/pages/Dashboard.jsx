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

  /*useEffect(() => {
    // Qui puoi passare i parametri che desideri alla funzione fetchTasks
    dispatch(fetchTasks());
    console.log(tasks)
  }, [dispatch]);*/

  return (
    <>
    <NavigationBar/>
      <div className='flex flex-col flex-wrap items-center sm:flex-row sm:justify-evenly sm:items-center py-5 px-'>
        {/*{tasksLoading && <p>Loading...</p>}
          {tasksError && <p>Error: {tasksError.message}</p>}
          {tasks && tasks?.map(task => (
            <Task
            title = {task.title}
            content = {task.content}
            category = {task.category}
            urgency = {task.urgency}
            deadLine = {task.deadLine}
            createdAt = {task.createdAt}
            complete ={task.complete}
            />
          ))}*/}
          <TasksContainer/>
      </div>
    </>
  )
}

export default Dashboard