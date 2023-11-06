import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SignUpModal from '../components/SignUpModal';
import axios from 'axios';
import { gapi } from 'gapi-script';

const Homepage = () => {
  const dynamicWords = ['notes', 'tasks', 'lists', 'goals', 'ideas'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSingUpModal, setShowSingUpModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % dynamicWords.length);
    }, 300); 
    return () => clearInterval(interval);
  }, []);

  const isToken = localStorage.getItem('userLoggedIn')

  const handlLogOut = () => {
    localStorage.removeItem('userLoggedIn')
  }

  const handleSignupGoogle =  () => {
    window.location.href = `${process.env.REACT_APP_SERVER_BASE_URL}auth/google`;
  }

  const initGoogleSignIn = () => {
    gapi.load('auth2', function() {
      const auth2 = gapi.auth2.init({
        client_id: '642460364954-asl4m355fbd84olo9id0qeriv6t919eo.apps.googleusercontent.com'
      });
      auth2.signIn()
      .then(googleUser => {
          if (auth2.isSignedIn.get()) {
            const idToken = googleUser.getAuthResponse().id_token;
            const tokenObject = {
              token: idToken
            }
            console.log(tokenObject)
            axios.post('http://localhost:5050/users/google', tokenObject)
              .then(response => {
                // Gestisci la risposta del server
                console.log(response.data);
              })
              .catch(error => {
                // Gestisci l'errore
                console.log(error);
              });
          } else {
            console.error('Errore durante l\'accesso a Google');
          }
        })
        .catch(error => {
          console.error('Errore durante l\'autenticazione Google', error);
        });
      });
  }

  return (
      <div className="flex flex-col justify-between h-screen">
        <ul className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-center py-5 px-5">
          <li className="font-primary font-weight: 900 text-5xl">Taskit</li>
          <div>
            {!isToken ?(
              <Link to="/login" className='no-underline'>
                <li className="font-secondary font-weight: 400 bg-indigo-950 rounded-3xl text-white w-24 text-center p-2 m-1">Login</li>
              </Link>
            ):(
              <li onClick={handlLogOut} className="font-secondary font-weight: 400 bg-indigo-950 rounded-3xl text-white w-24 text-center p-2 m-1">Logout</li>
            )
            }
            {isToken &&
              <Link to="/dashboard" className='no-underline'>
                <li className="font-secondary font-weight: 400 bg-indigo-950 rounded-3xl text-white w-24 text-center p-2 m-1">Dashboard</li>
              </Link>
            }
          </div>
        </ul>
        <div className='flex flex-col justify-center items-center h-screen m-auto '>
          <div className="flex flex-col items-center md:flex md:flex-row md:justify-content md:items-center">
            <span className='font-secondary text-1xl font-weight: 600 py-2 sm:text-3xl '>USE IT FOR YOUR </span>
            <span className='font-primary text-5xl font-weight: 900 py-2 sm:text-8xl'>{dynamicWords[currentIndex]}</span> 
          </div>
          <div className='flex justify-center'>
            <button className='font-secondary bg-indigo-950 rounded-3xl text-white w-24 text-center p-2'
            onClick={() => setShowSingUpModal(true)}>Signup</button>
          </div>
          <button
            onClick={handleSignupGoogle}
            className='font-secondary font-normal bg-indigo-950 rounded-3xl text-white w-46 text-center p-2 my-2'
            >
              Google Access
          </button>
          <button
            onClick={initGoogleSignIn}
            className='font-secondary font-normal bg-indigo-950 rounded-3xl text-white w-46 text-center p-2 my-2'
            >
              Google Access2
          </button>
        </div>
        {showSingUpModal && (
          <SignUpModal closeModal={() => setShowSingUpModal(false)} />
        )}
      </div>
  )
}

export default Homepage