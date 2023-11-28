import React, {useState} from 'react';
import { login } from '../redux/loginsSlice';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const isLoading = useSelector((state)=> state.logins.isLoading);
    const error = useSelector((state) => state.logins.error);
    const successMessage = useSelector((state)=> state.logins.successMessage);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
        console.log(loginData)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            const response = await dispatch(login(loginData));
            if (login.fulfilled.match(response)) {
                setLoginData({
                    email: '',
                    password: '',
                });
                setTimeout(() => {
                    navigate('/dashboard');
                  }, 2000);
            }
            
        } catch (error) {
            console.log(error)
            console.error('User login failed:', error);
        }
    }
  return (
    <>
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex items-center justify-center z-10 overflow-y-auto">
    <div className='bg-indigo-950 rounded-3xl text-white'></div>
      <form
        className='w-72 sm:w-96 form bg-indigo-950 rounded-3xl text-white text-center py-5 font-secondary'
        onSubmit={handleSubmit}
      >
        <div className='space-y-4'>
          <div>
            <label className='block'>Email</label>
            <input
              className='input rounded-3xl py-2 text-center text-black'
              type='text'
              placeholder='Your Email'
              name='email'
              value={loginData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className='block'>Password</label>
            <input
              className='input rounded-3xl py-2 text-center text-black'
              type='text'
              placeholder='Your Password'
              name='password'
              value={loginData.password}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className='flex flex-col items-center mt-3'>
            <button className='font-secondary font-normal bg-lime-500 rounded-3xl text-black w-24 text-center p-2 my-2' type='submit'>
              Login
            </button>
          {isLoading && <div className='custom-loader my-2'></div>}
          {error && <div className='font-secondary font-light text-red-600 p-2 text-xs'>{error}</div>}
          {successMessage && <div className='font-secondary font-light text-green-600 p-2 text-xs'>{successMessage}</div>}
        </div>
      </form>
    </div>
</>
  )
}

export default Login