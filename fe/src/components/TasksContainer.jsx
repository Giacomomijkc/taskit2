import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../redux/tasksSlice';
import Task from './Task';
import TaskModal from './TaskModal';
import TaskModalAi from './TaskModalAi';

const TasksContainer = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [urgencySort, setUrgencySort] = useState('');
  const [deadlineFilter, setDeadlineFilter] = useState('');

  const tasks = useSelector(state => state.tasks.tasks?.tasks);
  const tasksLoading = useSelector(state => state.tasks.tasks?.tasksLoading);
  const tasksError = useSelector(state => state.tasks.tasks?.tasksError);

  console.log(urgencySort)

  //limit, order, sortBy,

  useEffect(() => {
    dispatch(fetchTasks({ page, category: categoryFilter, urgency: urgencySort, deadline: deadlineFilter }));
  }, [dispatch, page, categoryFilter, urgencySort, deadlineFilter]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCategoryFilter = (event) => {
    setCategoryFilter(event.target.value);
    console.log(categoryFilter)
  };

  const handleUrgencySort = (event) => {
    setUrgencySort(event.target.value);
    console.log(urgencySort)
  };

  const handleDeadlineFilter = (event) => {
    setDeadlineFilter(event.target.value);
    console.log(deadlineFilter)
  };

  const [showModal, setShowModal] = useState(false);
  const [showModalAi, setShowModalAi] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleModalAi = () => {
    setShowModalAi(!showModalAi);
  };

  const refreshTasks = () => {
    dispatch(fetchTasks({ page, category: categoryFilter, urgency: urgencySort, deadline: deadlineFilter }));
  }

  return (
    <div>
      <div className='flex flex-col justify-center gap-2 mb-2 sm:flex-row'>
        <div>
          <select className='font-secondary text-sm bg-indigo-950 rounded-3xl text-white text-center p-2 w-80' value={urgencySort} onChange={handleUrgencySort}>
            <option value="">Sort by urgency</option>
            <option value="low">Low</option>
            <option value="mid">Mid</option>
            <option value="high">High</option>
            <option value="extreme">Extreme</option>
          </select>
        </div>
        <div>
          <input className='font-secondary text-sm bg-indigo-950 rounded-3xl text-white text-center p-2 w-80' type="date" value={deadlineFilter} onChange={handleDeadlineFilter} />
        </div>
        <div>
          <input className='font-secondary text-sm bg-indigo-950 rounded-3xl text-white text-center p-2 w-80' type="text" placeholder="Filter by category" value={categoryFilter} onChange={handleCategoryFilter} />
        </div>
      </div>
      
      <div className='flex flex-col flex-wrap items-center sm:flex-row sm:justify-evenly sm:items-center gap-5'>
        {tasksLoading && <p>Loading...</p>}
        {tasksError && <p>Error: {tasksError.message}</p>}
        {tasks && tasks.map(task => (
          <Task key={task._id} {...task} refreshTasks={refreshTasks} />
        ))}
      </div>

      {/* Qui puoi inserire i controlli di paginazione */}
      <div className='flex flex-row justify-center items-center mt-2'>
        <button className='font-secondary text-sm bg-indigo-950 rounded-3xl text-white w-24 text-center p-2 m-1' onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>Previous</button>
        <span className='font-secondary text-xl text-indigo-950'>Page {page}</span>
        <button className='font-secondary text-sm bg-indigo-950 rounded-3xl text-white w-24 text-center p-2 m-1' onClick={() => handlePageChange(page + 1)}>Next</button>
      </div>
      <button 
      onClick={toggleModal}
      className="font-secondary text-sm fixed bottom-4 right-4 bg-indigo-950 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 w-28">
      Add Task
      </button>
      <button 
      onClick={toggleModalAi}
      className="font-secondary text-sm fixed bottom-4 left-4 bg-indigo-950 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 w-28">
      Add with AI
      </button>

      {showModal && <TaskModal toggleModal={toggleModal} showModal={showModal} refreshTasks={refreshTasks} />}
      {showModalAi && <TaskModalAi toggleModalAi={toggleModalAi} showModalAi={showModalAi} refreshTasks={refreshTasks} />}

    </div>
    
    
  );
};

export default TasksContainer;
