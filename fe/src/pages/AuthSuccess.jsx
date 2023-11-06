import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
    const navigate = useNavigate();
    useEffect(() => {
        // Check the full URL with the token parameter
        console.log("Full URL:", window.location.href);

        // Check if token is already in localStorage
        let token = localStorage.getItem('userLoggedIn');

        // If token is not in localStorage, try to get it from URL
        if (!token) {
            const urlParams = new URLSearchParams(window.location.search);
            token = urlParams.get('token');
        }

        // If token is found, save it in localStorage
        if (token) {
          //localStorage.setItem('userLoggedIn', token);
          //localStorage.setItem('userLoggedIn', token);
          token = token.replace(/\"/g, '');
          //localStorage.setItem('userLoggedIn', token);
          localStorage.setItem('userLoggedIn', JSON.stringify(token));
          navigate('/dashboard');
        } else {
          //mettere un redirect corretto per questo caso
            navigate('/login');
        }
    }, []);


  return (
    <div className='font-primary text-5xl font-weight: 900 py-2 sm:text-8xl'>Checking...</div>
  )
}

export default AuthSuccess