import React, {useState} from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { deleteTask, completeTask } from '../redux/tasksSlice';
import { useDispatch } from 'react-redux';
import { useSpring, animated } from 'react-spring';
import { gsap } from 'gsap';


const Task = ({title, content, category, urgency, deadLine, createdAt, completed, _id, refreshTasks}) => {

    const dispatch = useDispatch();
    const userId = useSelector((state)=> state.users.userLogged.user._id);

    const [isBurning, setIsBurning] = useState(false);

    const burnTask = async() =>{
      setIsBurning(true);
      setTimeout(async () => {
        await dispatch(deleteTask(_id));
        refreshTasks();
        setIsBurning(false);
      }, 2000);
    }

    const makeTaskComplete = async() =>{
      await dispatch(completeTask(_id));
      refreshTasks();
    }

    const taskClasses = isBurning ? 'fire-effect' : ''; 

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
          case 'low':
            return 'bg-green-500';
          case 'mid':
            return 'bg-yellow-500';
          case 'high':
            return 'bg-orange-500';
          case 'extreme':
            return 'bg-red-500';
          default:
            return 'bg-gray-500';
        }
    };

  return (
    <>
    <div className={`${taskClasses} max-w-sm rounded-xl border border-indigo-950 font-secondary shadow-md`}>
      <div className="p-5 bg-indigo-950 rounded-t-lg">
        <h5 className="text-lg tracking-tight text-white font-primary text-center">{title}</h5>
      </div>
      <div className="p-5 font-secondary">
        <p className="mb-3 font-normal text-indigo-950">{content}</p>
        <p className="text-sm text-indigo-950">Category {category}</p>
        <div className='flex flex-row items-center'>
            <div className="text-sm text-indigo-950 mr-1">Urgency level</div>
            <div className={`ml-1 w-8 h-4 ${getUrgencyColor(urgency)}`} />
        </div>
        {deadLine &&
        <p className="text-sm text-indigo-950">Deadline: {deadLine}</p>
        }
        <p className="mt-2 text-xs text-indigo-950">Created on: {createdAt}</p>
        {!completed ? (
            <p className="text-xs text-indigo-950">Status: pending</p> 
            ) :(
            <p className="text-xs text-indigo-950">Status: ✅</p>
            )
        }
        <div className='flex flex-row justify-between'>
        {completed ? (
          <button onClick={burnTask}>🔥</button>
          ) : (
          <button onClick={makeTaskComplete}>✅</button>
          )
        }
        </div>
      </div>
    </div>
    </>
  )
}

export default Task