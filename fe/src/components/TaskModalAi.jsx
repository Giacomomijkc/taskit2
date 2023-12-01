import React, {useState} from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTaskAi} from '../redux/tasksSlice';

const TaskModalAi = ({ toggleModalAi, showModalAi, refreshTasks }) => {

    const userId = useSelector((state)=> state.users.userLogged.user._id);
    //gestire bene errori da renderizzare
    const errorNewTaskAi = useSelector((state)=> state.tasks.errorNewTaskAi);
    const successMessageNewTaskAi = useSelector((state)=> state.tasks.successMessageNewTaskAi);

    const dispatch = useDispatch()

    const [textTask, setTextTask] = useState('');

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('')
    

    
    const handleInputChange = (e) => {
        // Directly set the value without spreading an object
        setTextTask(e.target.value);
    }
    console.log({ textTask });
  

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const taskData = { textTask: textTask };
            const response = await dispatch(createTaskAi(taskData));
            if(createTaskAi.fulfilled.match(response)){
                setTextTask({
                    textTask: ''
                });
                //inserire messaggio successo
                setSuccessMessage(successMessageNewTaskAi)
                console.log(successMessage)
                refreshTasks();
                setTimeout(() =>{
                    toggleModalAi()
                }, 3000)
            }
        } catch (error) {
            console.log(error)
            console.error('Task creation failed:', error);
            setError(errorNewTaskAi)
        }
    }
    
    return (
        <>
        {showModalAi &&
            <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex items-center justify-center z-10 overflow-y-auto">
              <form
                className='w-[800px] sm:w-[500px] form bg-indigo-950 rounded-3xl text-white text-center py-5 font-secondary'
                onSubmit={handleSubmit}
              >
                <div className='space-y-4'>
                  <div>
                    <label className='block'>Task</label>
                    <textarea
                      className='w-[200px] input rounded-3xl py-2 text-center text-black w-300 overflow-y-auto'
                      type='text'
                      placeholder='Describe your task'
                      value={textTask.textTask}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className='flex flex-col items-center mt-3'>
                    <button className='font-secondary font-normal bg-lime-500 rounded-3xl text-black w-24 text-center p-2 my-2' type='submit'>
                      Create
                    </button>
                    <button className='font-secondary font-normal bg-lime-500 rounded-3xl text-black w-24 text-center p-2 my-2' onClick={toggleModalAi}>
                      Close
                    </button>
                  
                  {errorNewTaskAi && <div className='font-secondary font-light text-red-600 p-2 text-xs'>{error}</div>}
                  {successMessageNewTaskAi && <div className='font-secondary font-light text-green-600 p-2 text-xs'>{successMessage}</div>}
                </div>
              </form>
            </div>
        }
    </>
      )
}

export default TaskModalAi