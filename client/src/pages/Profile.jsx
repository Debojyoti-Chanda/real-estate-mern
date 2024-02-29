import React from 'react'
import { useSelector } from 'react-redux'
const Profile = () => {
  const { currentUser } = useSelector(state => state.user);
  return (
    <>
      <h1 className='text-2xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col justify-center items-center gap-5'>
        <img src={currentUser.avatar} alt='Profile Picture' className='w-24 h-24 rounded-full object-cover cursor-pointer' />
        <input type='text' name="username" id="username" placeholder='Username' className='border p-3 rounded-xl  md:w-2/4' />
        <input type='email' name='email' id='email' placeholder='Email' className='border p-3 rounded-xl  md:w-2/4' />
        <input type='password' name='password' id='password' placeholder='Password' className='border p-3 rounded-xl  md:w-2/4' />
        <button className='bg-slate-200 w-1/4 p-2 rounded-2xl hover:bg-slate-500 hover:text-white'>Update</button>
      </form>
      <div className='flex flex-row justify-between items-center w-2/4 mx-auto mt-4 md:mt-8'>
        <span className='text-red-700 cursor-pointer'> Delete Account</span> 
        <span className='text-red-700 cursor-pointer'>Sign Out</span> 
      </div>
    </>
  )
}

export default Profile