import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import Homepage from "./pages/Homepage";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import TestPage from './pages/TestPage';
import AuthSuccess from './pages/AuthSuccess';
import VerifyUser from './pages/VerifyUser';
import {loggedUserById} from './redux/usersSlice'
import ProtectedRoutes from './middlewares/ProtectedRoutes';



const App = () => {
  const dispatch = useDispatch();

  useEffect(()=>{
    const token = JSON.parse(localStorage.getItem("userLoggedIn"));
    console.log('il token', token)
    if(token){
      const decodedToken = jwtDecode(token);
      dispatch(loggedUserById(decodedToken._id))
      console.log('ho dispatchatooooooo')
    }

  }, [dispatch])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Homepage/>}/>
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/auth/success" element={<AuthSuccess/>}/>
          <Route path ="users/verify" element={<VerifyUser/>}/>
          <Route element={<ProtectedRoutes/>}>
            <Route exact path="/dashboard" element={<Dashboard/>}/>
            <Route exact path="/testpage" element={<TestPage/>}/>
          </Route>
          <Route path="*" element={<ErrorPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
