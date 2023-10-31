import React, { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import Login from '../pages/Login';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const auth = () => {
    return JSON.parse(localStorage.getItem('userLoggedIn'));
};

const useSession = () => {
    const session = auth();
    const decodedSession = session ? jwtDecode(session) : null;

    const navigate = useNavigate();

    useEffect(() => {
        if (!session) {
            navigate('/', { replace: true });
        } else {
            const currentTime = Date.now() / 1000;
            if (decodedSession && decodedSession.exp < currentTime) {
                navigate('/login', { replace: true });
            }
        }
    }, [navigate, session, decodedSession]);

    return decodedSession;
};

const ProtectedRoutes = () => {
    const isAuthorized = auth();
    const session = useSession();

    return isAuthorized ? <Outlet /> : <Login />;
}

export default ProtectedRoutes;


/*const checkToken = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        console.log('Token exp:', decodedToken.exp);
        console.log('Current time:', currentTime);
        console.log('Token valid:', decodedToken.exp > currentTime);
        return decodedToken.exp > currentTime;
    } catch (error) {
        return false
    }
}

const ProtectedRoutes = () => {
    const token = JSON.parse(localStorage.getItem('userLoggedIn'));
    return token && checkToken(token) ? <Outlet/> : <Login />
}

export default ProtectedRoutes;*/