import { faBan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUser } from '../redux/slices/user-actions.slice';

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function DeleteProfile() {
   let dispatch = useDispatch();
   let currentUser = useSelector(state => state.getUser)
   async function handleDelete(){
    let isConfirm = window.confirm('Do u want to delete your account?');
    if(isConfirm){
        await dispatch(deleteUser(currentUser?.data?.message?._id));
        window.location.reload();
    }
   }
  return (
    <div className='overflow-hidden'>
        <div className=" mt-20 w-screen flex flex-col items-center justify-center">
            <div onClick={handleDelete} className="main-btn del">Delete Account <FontAwesomeIcon icon={faBan} /> </div>
        </div>
    </div>
  )
}

export default DeleteProfile