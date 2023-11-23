import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../redux/tasksSlice';
import Task from './Task';

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

  return (
    <div>
      <input type="text" placeholder="Filter by category" value={categoryFilter} onChange={handleCategoryFilter} />
      <select value={urgencySort} onChange={handleUrgencySort}>
        <option value="">Sort by urgency</option>
        <option value="low">Low</option>
        <option value="mid">Mid</option>
        <option value="high">High</option>
        <option value="extreme">Extreme</option>
      </select>
      <input type="date" value={deadlineFilter} onChange={handleDeadlineFilter} />
      
      {tasksLoading && <p>Loading...</p>}
      {tasksError && <p>Error: {tasksError.message}</p>}
      {tasks && tasks.map(task => (
        <Task key={task._id} {...task} />
      ))}

      {/* Qui puoi inserire i controlli di paginazione */}
      <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>Previous</button>
      <span>Page {page}</span>
      <button onClick={() => handlePageChange(page + 1)}>Next</button>
    </div>
  );
};

export default TasksContainer;
