'use client';
import React, { useState } from 'react'
import {assets} from '@/assets/assets'
import { toast } from 'react-hot-toast';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';


const MyProfile = () => {
  const {user, setUser, fetchUserProfileInfo, axios} = useAppContext();

  const [isEdit, setIsEdit] = useState(false);
  //updat profile logic
  const [image, setImage] = useState(false);

  const updateUserProfileData = async()=>{
    try {
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('phone', user.phone);
      formData.append('address', JSON.stringify(user.address));
      formData.append('gender', user.gender);
      formData.append('dob', user.dob);

      if(image){ //optional
        formData.append('profileImage', image);
      }
      
      const {data} = await axios.put(`/api/auth/user/update-profile`, formData);
      
      if(data.success){
        toast.success(data.message);
        await fetchUserProfileInfo(); // update user data
        setIsEdit(false);
      }

    } catch (error) {
      console.log(error);
      toast.error('Failed to update profile'+ error.message);
    }
  }

  return user && (
    <div className='mx-4 my-8 sm:mx-[10%] max-w-lg flex flex-col gap-2 text-sm'>
      {isEdit? <label htmlFor="image" className='w-30'>
        <div className='inline-block relative cursor-pointer'>
          <Image src={image? URL.createObjectURL(image): user?.profileImage } width={1000} height={1000} alt="" className='w-36 rounded opacity-75 bg-primary/60'/>

          {/* when user does not upload image while creating the account show upload area else show uploaded image with low opacity as above */}
          <Image src={image ? URL.createObjectURL(image) : (user.profileImage || assets.default_profile)}width={1000} height={1000} alt="Profile Image" className='w-36 rounded opacity-75 bg-primary/60'/>
        </div>
        <input onChange={(e)=> setImage(e.target.files[0])} type="file" id="image" hidden />
      </label> :<Image src={user?.profileImage} width={1000} height={1000} alt="" className='w-36 rounded bg-primary'/>}

      {
        isEdit? <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' value={user.name} onChange={e=> setUser(prev => ({...prev, name:e.target.value}))} type="text" /> : <p className='font-medium text-3xl text-neutral-800 mt-4'>{user.name}</p>
      }

      <hr className='bg-zinc-500 h-[1px] border-none'/>

      <div>
        <p className='text-gray-600 underline mt-3'>CONTACT INFORMATION</p>

        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
          <p className='font-medium'>Email ID:</p>
          <p className='text-blue-600'>{user.email}</p>

          <p className='font-medium'>Phone:</p>
          {
            isEdit? <input className='bg-gray-100 max-w-52' value={user.phone} onChange={e=> setUser(prev => ({...prev, phone:e.target.value}))} type="text" /> : <p className='text-blue-600'>{user.phone}</p>
          }

          <p className='font-medium'>Address:</p>
          {
            isEdit? <p>
              <input className='bg-gray-100 max-w-52' value={user.address.line1} onChange={e=> setUser(prev => ({...prev, address: {...prev.address, line1: e.target.value}}))} type="text" /> <br />
              <input className='bg-gray-100 max-w-52' value={user.address.line2} onChange={e=> setUser(prev => ({...prev, address: {...prev.address, line2: e.target.value}}))} type="text" />
            </p> : <p className='text-gray-600'>{user.address.line1} <br />{user.address.line2}</p>
          }

        </div>
      </div>

      <div>
        <p className='text-gray-600 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
          <p className='font-medium'>Gender:</p>
          {
            isEdit? <select onChange={e => setUser(prev => ({...prev, gender:e.target.value}))} value={user.gender} className='max-w-20 bg-gray-100'>
              <option value="Male">Male</option>
              <option value="Female">Female</option>

            </select> : <p className='text-gray-600'>{user.gender}</p>
          
          }

          <p className='font-semibold text-gray-600'>Birth Date:</p>              
          {
            isEdit? <input className='max-w-28 bg-gray-100' value={user.dob} onChange={e=> setUser(prev => ({...prev, dob:e.target.value}))} type="date" /> : <p className='text-gray-600'>{user.dob}</p>
          }
        </div>

      </div>

      <div className='mt-10'>
        {!isEdit ?<button onClick={()=> setIsEdit(true)} className='px-8 py-3 border bg-primary text-white rounded-lg hover:scale-105 transition-all duration-300 cursor-pointer'>Edit</button>:

        <button onClick={updateUserProfileData} className='px-4 py-3 border-2 border-primary rounded-lg hover:scale-105 transition-all duration-300 cursor-pointer'>Save Information</button>}
      </div>

    </div>
  )
}

export default MyProfile
