import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { clearAction, updateUser } from "../../redux/slices/user-actions.slice";
import { getUser } from "../../redux/slices/getuser.slice";
import { hostName } from "../../endpoints";
import { getSingleUser } from "../../redux/slices/adminSlices/getSingleUser.slice";
import { toast } from "react-toastify";

function EditUserProfile() {
  let navigate = useNavigate();
  let params = useParams();
  let dispatch = useDispatch();
  let prevRef = useRef(null);
  let userAction = useSelector(state => state.userActions)
  let singleUser = useSelector(state => state.singleUser);

  let [alertMsg , setAlertMsg] = useState('');
  let [profile, setProfile] = useState('');
  let [name, setName] = useState('');
  
  async function handleSubmit(e){
    e.preventDefault();
    let data = new FormData;
    data.append('name', name);
    if(profile && profile != ''){
        data.append('profilePic', profile);
    }

    await dispatch(updateUser({id :  params.id, data}));
    await dispatch(getSingleUser(params.id));
    await dispatch(clearAction());
  }

  async function handlePrev(e){
    let file = e.target.files;
    if(file[0] && file[0].size > (1024 * 1024 * 5)){
        setAlertMsg('file must be less than 5mb');
        return
    }
    if(file[0] && file[0].size <= (1024 * 1024 * 5)){
        setProfile(file[0]);
        let blob = URL.createObjectURL(file[0]);
        setAlertMsg('');
        if(prevRef.current){
            prevRef.current.src = blob;
        }
    }
  }

  useEffect(() =>{
    if(!singleUser?.data && singleUser?.data?.message?._id != params.id){
        dispatch(getSingleUser(params.id));
    }
  },[params, dispatch, singleUser])
  useEffect(() =>{
    dispatch(getSingleUser(params.id))
  },[])
 
  useEffect(()=>{
    if(singleUser?.data){
        setName(singleUser?.data?.message?.name)
    }
  },[singleUser, dispatch])

  useEffect(() => {
    if(userAction?.isUpdated){
        toast[`${userAction?.isUpdated ? 'success' : 'error' }`](`${'User updated successfully'}`);
    }
  },[dispatch, userAction])


  return (
    <div className="w-full mt-5 py-14 bg-off-white overflow-auto flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white shadow-2xl flex flex-col items-center md:w-1/3 sm:w-1/2  w-11/12 py-5 px-3 gap-y-2">
          <div className="text-2xl font-bold text-center mb-3">Edit Profile</div>  
          <label htmlFor="profile" className="bg-red-100 cursor-pointer profile-img rounded-full">
            <img src={`${hostName}/public/temp/${singleUser?.data?.message?.profilePic}`} ref={prevRef}  height={'60px'} width={'60px'} className="rounded-full" alt="profile" />
          </label>
          <input type="file" onChange={handlePrev} id="profile" name="profile" className="hidden" />
          
          {
            alertMsg && alertMsg != '' && <div className="wrong-alert">{alertMsg}</div>
          }
          <input type="text" value={name} required onChange={(e) => setName(e.target.value)} placeholder="name" className="input-field" />

          <button disabled={userAction?.isLoading} className="main-btn mt-5">{userAction?.isLoading ? 'updating please wait..' : 'Update' } {userAction?.isLoading && <div className="loader ms-3"></div> }</button>
        
      </form>
    </div>
  );
}

export default EditUserProfile;
