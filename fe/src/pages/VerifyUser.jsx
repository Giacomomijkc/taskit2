import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { verifyUser } from '../redux/usersSlice';
import { useDispatch, useSelector } from 'react-redux';

const VerifyUser = () => {

    const dispatch = useDispatch();

    const verified = useSelector((state) => state.users.userVerify);
    const verifying = useSelector((state) => state.users.isVerifing);
    const errorVerify = useSelector((state) => state.users.errorVerify)

    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const cleanToken = token.replace(/\"/g, '');

    useEffect(() =>{
        dispatch(verifyUser(cleanToken))
    }, [])   
  return (
    <>
    {verifying ? (
      <div>Verifing your account..</div>
    ) : verified ? (
        <>
      <div>{verified.message}</div>
      <Link to="/login" className='no-underline'>
        <button className="font-secondary bg-indigo-950 rounded-3xl text-white w-40 text-center p-2 m-1">Go to Login</button>
      </Link>
      </>
    ) : errorVerify && (
      <>
        <div>Verification failed</div>
        <div>{errorVerify}</div>
      </>
    ) }
    </>
  )
}

export default VerifyUser