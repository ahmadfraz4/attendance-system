import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/login.slice";
import { getUser } from "../redux/slices/getuser.slice";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Login() {
  let dispatch = useDispatch();
  let navigate = useNavigate();

  let user = useSelector(state => state.logedInUser)
  let currentUser = useSelector(state => state.getUser)

  let [rollNo, setRollNo] = useState('');
  let [password, setPassword] = useState('');
  // console.log(user)
  async function handleSubmit(e){
    e.preventDefault();
    await  dispatch(loginUser({ rollNo, password }));
    await dispatch(getUser());
  }

  useEffect(() => {
      if(!currentUser.data){
        dispatch(getUser())
      }
  },[user, dispatch, currentUser])

  useEffect(() => {
    if(currentUser?.data?.success){
       navigate('/');
    }
  },[navigate, currentUser])

  return (
    <div className="h-screen w-full bg-off-white overflow-auto flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white shadow-2xl flex flex-col md:w-1/3 sm:w-1/2  w-11/12 py-5 px-3 gap-y-2">
          <div className="text-2xl font-bold text-center">Login</div>  
          {
            !user.isLoading && user?.data?.success == false &&  <div className="wrong-alert">{user?.data?.message}</div>
          }
          <input type="number" value={rollNo} onChange={(e) => setRollNo(e.target.value)} placeholder="roll no" className="input-field" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" className="input-field" />
          <button disabled={user?.isLoading} className="main-btn mt-5">{user?.isLoading ? 'please wait..' : 'Submit' } {user?.isLoading && <div className="loader ms-3"></div> }</button>
          <div className="flex mt-3">
             not registered yet ? <Link to={'/register'} className="main-blue inline-block ms-3">register now</Link>
          </div>
      </form>
    </div>
  );
}

export default Login;
