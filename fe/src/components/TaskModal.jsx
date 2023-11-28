import React, {useState} from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTask, fetchTasks } from '../redux/tasksSlice';

const TaskModal = ({ toggleModal, showModal, refreshTasks }) => {

    const userId = useSelector((state)=> state.users.userLogged.user._id);
    //gestire bene errori da renderizzare
    const errorNewTask = useSelector((state)=> state.tasks.errorNewTask);
    const successMessageNewTask = useSelector((state)=> state.tasks.successMessageNewTask);

    const dispatch = useDispatch()

    const [taskData, setTaskData] = useState({
        title: '',
        content: '',
        category: '',
        urgency: '',
        deadLine: '',
        completed: false
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('')

    
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setTaskData({
            ...taskData,
            [name]: value,
        });
    }
    console.log(taskData)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            const completeTaskData = {...taskData, author: userId }
            
            const response = await dispatch(createTask(completeTaskData));
            if(createTask.fulfilled.match(response)){
                setTaskData({
                    title: '',
                    content: '',
                    category: '',
                    urgency: '',
                    deadLine:'' 
                });
                //inserire messaggio successo
                setSuccessMessage(successMessageNewTask)
                console.log(successMessage)
                refreshTasks();
                setTimeout(() =>{
                    toggleModal()
                }, 3000)
            }
        } catch (error) {
            console.log(error)
            console.error('Task creation failed:', error);
            setError(errorNewTask)
        }
    }
    
    return (
        <>
        {showModal &&
            <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex items-center justify-center z-10 overflow-y-auto">
              <form
                className='w-72 sm:w-96 form bg-indigo-950 rounded-3xl text-white text-center py-5 font-secondary'
                onSubmit={handleSubmit}
              >
                <div className='space-y-4'>
                  <div>
                    <label className='block'>Title</label>
                    <input
                      className='input rounded-3xl py-2 text-center text-black'
                      type='text'
                      placeholder='Task Title'
                      name='title'
                      value={taskData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className='block'>Content</label>
                    <input
                      className='input rounded-3xl py-2 text-center text-black'
                      type='text'
                      placeholder='Task Content'
                      name='content'
                      value={taskData.content}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className='block'>Category</label>
                    <input
                      className='input rounded-3xl py-2 text-center text-black'
                      type='text'
                      placeholder='Task Category'
                      name='category'
                      value={taskData.category}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className='block'>Deadline</label>
                    <input
                      className='input rounded-3xl py-2 text-center text-black'
                      type='text'
                      placeholder='Task Category'
                      name='deadLine'
                      value={taskData.deadLine}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <select className='font-secondary text-sm bg-indigo-950 rounded-3xl text-white text-center p-2 w-80'  name='urgency' value={taskData.urgency} onChange={handleInputChange}>
                        <option value="">Sort by urgency</option>
                        <option value="low">Low</option>
                        <option value="mid">Mid</option>
                        <option value="high">High</option>
                        <option value="extreme">Extreme</option>
                    </select>
                  </div>
                </div>
                <div className='flex flex-col items-center mt-3'>
                    <button className='font-secondary font-normal bg-lime-500 rounded-3xl text-black w-24 text-center p-2 my-2' type='submit'>
                      Create
                    </button>
                    <button className='font-secondary font-normal bg-lime-500 rounded-3xl text-black w-24 text-center p-2 my-2' onClick={toggleModal}>
                      Close
                    </button>
                  
                  {errorNewTask && <div className='font-secondary font-light text-red-600 p-2 text-xs'>{error}</div>}
                  {successMessageNewTask && <div className='font-secondary font-light text-green-600 p-2 text-xs'>{successMessage}</div>}
                </div>
              </form>
            </div>
        }
    </>
      )
}

export default TaskModal