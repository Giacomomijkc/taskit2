import React, {useState, useRef} from 'react'
import { uploadAvatar, registerUser } from '../redux/usersSlice';
import {useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const SignUpModal = ({ closeModal }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    

    const [formData, setFormData] = useState({
      nickname: '',
      email: '',
      password: ''
    })


    const avatarURL = useSelector((state) => state.users.avatarURL);
    const error = useSelector((state) => state.users.error);
    const successMessage = useSelector((state) => state.users.successMessage);
    const coverInputRef = useRef(null);
    const isUploadLoading = useSelector((state) => state.users.isUploadLoading);

    const signUpMethod = "local";

    const handleInputChange = (e) => {
      const { name, value } = e.target;
          setFormData({
              ...formData,
              [name]: value,
          });
          console.log(formData)
    };

  

    const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      const uploadData = new FormData();
      uploadData.append('avatar', file);
  
      try {
          await dispatch(uploadAvatar(uploadData));
          console.log(avatarURL)
      } catch (error) {
          console.error('File upload failed:', error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const userData = {
          ...formData,
          avatar: avatarURL,
          method: signUpMethod
      };
  
      try {
          const response = await dispatch(registerUser(userData));
          setFormData({
              nickname: '',
              email: '',
              password: '',
          });
          coverInputRef.current.value = null;
          if (registerUser.fulfilled.match(response)) {
              setTimeout(() => {
                  navigate('/login');
                }, 2000);
          }

      } catch (error) {
          console.error('User registration failed:', error);

      }
  };


  return (
    <>
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex items-center justify-center z-10 overflow-y-auto">
        <div className='bg-indigo-950 rounded-3xl text-white'></div>
          <form
            encType='multipart/form-data'
            className='w-72 sm:w-96 form bg-indigo-950 rounded-3xl text-white text-center py-5 font-secondary'
            onSubmit={handleSubmit}
          >
            <h1 className='title me-auto mb-4'>Create your account!</h1>
            <div className='space-y-4'>
              <div>
                <label className='block'>Nickname</label>
                <input
                  className='input rounded-3xl py-2 text-center text-black'
                  type='text'
                  placeholder='Your Nickname'
                  name='nickname'
                  value={formData.nickname}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className='block'>Email</label>
                <input
                  className='input rounded-3xl py-2 text-center text-black'
                  type='text'
                  placeholder='Your Email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className='block'>Password</label>
                <input
                  className='input rounded-3xl py-2 text-center text-black'
                  type='text'
                  placeholder='Insert a password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                {/*styling del bottone default "sfoglia"*/}
                <span className='flex flex-col'>Avatar</span>
                <label className='block custom-file-upload'>
                  <input
                    className='w-64 sm:w-80 input rounded-3xl py-2 text-center text-black bg-lime-500'
                    type='file'
                    name='avatar'
                    ref={coverInputRef}
                    onChange={handleFileUpload}
                  />
                  Click to upload
                  </label>
              </div>
            </div>
            <div className='flex flex-col items-center mt-3'>
              {isUploadLoading ? (
                <div className='custom-loader my-2'></div>
              ) : (
                <button className='font-secondary font-normal bg-lime-500 rounded-3xl text-black w-24 text-center p-2 my-2' type='submit'>
                  Create
                </button>
              )}
              <button
                onClick={closeModal}
                className='font-secondary font-normal bg-lime-500 rounded-3xl text-black w-24 text-center p-2 my-2'
                >
                  Close
                </button>
              {error && <div className='font-secondary font-light text-red-600 p-2 text-xs'>{error}</div>}
              {successMessage && <div className='font-secondary font-light text-green-600 p-2 text-xs'>{successMessage}</div>}
            </div>
          </form>
        </div>
    </>
  )
}

export default SignUpModal