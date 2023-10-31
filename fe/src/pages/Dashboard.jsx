import React from 'react'
import {Link} from 'react-router-dom'

const Dashboard = () => {
  return (
    <>
    <div>Dashboard</div>
    <Link to="/testpage" className='no-underline'>
        <button>Go to Test Page</button>
    </Link>
    </>
  )
}

export default Dashboard