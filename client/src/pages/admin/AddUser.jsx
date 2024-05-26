import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addUser, clearLog } from "../../redux/slices/login.slice";
import { getUser } from "../../redux/slices/getuser.slice";
import { toast } from "react-toastify";

function AddUser() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let prevRef = useRef(null);
  let user = useSelector(state => state.logedInUser);
  let [alertMsg , setAlertMsg] = useState('');
  let currentUser = useSelector(state => state.getUser)
  let imageAddress = 'https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg';
  let [name, setName] = useState('');
  let [profile, setProfile] = useState('');
  let [password, setPassword] = useState('');
  
  async function handleSubmit(e){
    e.preventDefault();
    let data = new FormData;
    data.append('name', name);
    data.append('password', password);
    data.append('profilePic', profile)

    await dispatch(addUser(data));
    await dispatch(getUser());
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
    if(user?.data?.message){
        toast[`${user?.data?.message ? 'success' : 'error' }`](`${user?.data?.success ? 'User add successfully' : 'Something went wrong Try later' }`)
    }
    dispatch(clearLog());
  },[dispatch])

  useEffect(() => {
    if(!currentUser.data){
      dispatch(getUser())
    }
},[user, dispatch, currentUser])


  return (
    <div className="h-screen w-full bg-off-white overflow-auto flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white shadow-2xl flex flex-col items-center md:w-1/3 sm:w-1/2  w-11/12 py-5 px-3 gap-y-2">
          <div className="text-2xl font-bold text-center mb-3">Add User</div>  
          <label htmlFor="profile" className="bg-red-100 cursor-pointer profile-img rounded-full">
            <img src={imageAddress} ref={prevRef}  height={'60px'} width={'60px'} className="rounded-full" alt="profile" />
          </label>
          <input type="file" required onChange={handlePrev} id="profile" name="profile" className="hidden" />
          {
            alertMsg && alertMsg != '' && <div className="wrong-alert">{alertMsg}</div>
          }
          {
            !user.isLoading && user?.data?.success == false &&  <div className="wrong-alert">{user?.data?.message}</div>
          }
          <input type="text" value={name} required onChange={(e) => setName(e.target.value)} placeholder="name" className="input-field" />
          <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} placeholder="password" className="input-field" />
          <button disabled={user?.isLoading} className="main-btn mt-5">{user?.isLoading ? 'please wait..' : 'Submit' } {user?.isLoading && <div className="loader ms-3"></div> }</button>
          <div className="flex mt-3 w-full">
             already have account ? <Link to={'/login'} className="main-blue inline-block ms-3">Login now</Link>
          </div>
      </form>
    </div>
  );
}

export default AddUser;
