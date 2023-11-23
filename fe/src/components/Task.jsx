import React from 'react'

const Task = ({title, content, category, urgency, deadline, createdAt, complete}) => {

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
    <div className="max-w-sm rounded-xl border border-indigo-950 font-secondary shadow-md">
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
        {deadline &&
        <p className="text-sm text-indigo-950">Deadline: {deadline}</p>
        }
        <p className="mt-2 text-xs text-indigo-950">Created on: {createdAt}</p>
        {!complete ? (
            <p className="text-xs text-indigo-950">Status: pending</p> 
            ) :(
            <p className="text-xs text-indigo-950">Status: completed ✅</p>
            )
        }
      </div>
    </div>
    </>
  )
}

export default Task