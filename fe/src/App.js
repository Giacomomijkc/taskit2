import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Homepage from "./pages/Homepage";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import TestPage from './pages/TestPage';
import ProtectedRoutes from './middlewares/ProtectedRoutes';


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Homepage/>}/>
          <Route exact path="/login" element={<Login/>}/>
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
