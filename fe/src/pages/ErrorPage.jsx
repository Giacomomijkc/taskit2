import React from 'react';
import {Link} from 'react-router-dom'

const ErrorPage = () => {
  return (
    <>
    <div className='flex flex-col justify-center items-center h-screen m-auto text-center'>
        <div>
            <h2 className='font-primary text-2xl sm:text-5xl'>ooooooooops, this page doesnt' exist</h2>
        </div>
        <div>
            <Link to="/" className="no-underline">
                <button className="font-secondary font-weight: 400 bg-indigo-950 rounded-3xl text-white w-28 text-center p-3 m-1">Go to Home</button>
            </Link>
        </div>
    </div>
    </>
  )
}

export default ErrorPage