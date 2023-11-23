import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {

    const navigate = useNavigate();
    const user = useSelector((state) => state.users.userLogged?.user)

    //devo fare in modo che richekki la get dell'utente perché a volte se non refresho 
    //quando mi loggo "local" prende avatar precedente

    const handlLogOut = () => {
        localStorage.removeItem('userLoggedIn')
        navigate('/');
    }

  return (
    <ul className="flex items-center sm:flex-row sm:justify-between sm:items-center py-5 px-5">
        {user && 
        <>
        <li onClick={handlLogOut} className="cursor-pointer font-secondary font-weight: 400 bg-indigo-950 rounded-3xl text-white w-24 text-center p-2 m-1">Logout</li>
        <div className='flex items-center'>
        <li>
             <img src={user?.avatar} className='w-12 h-12 rounded-full object-cover' />
        </li>
        <li className="font-secondary text-indigo-950 w-40 text-center text-2xl">
                👋 {user?.nickname}
        </li>
        </div>
        </>
        }
    </ul>
  )
}

export default NavigationBar