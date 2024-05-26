import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearData, markAttendance } from '../redux/slices/attendanceSlices/mark.slice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../redux/slices/allUser.slice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faForward } from '@fortawesome/free-solid-svg-icons';
import { deleteUser } from '../redux/slices/user-actions.slice';
import { getUser } from '../redux/slices/getuser.slice';
import { pageNo } from '../redux/slices/adminSlices/pageSlice';
function Home() {
  let dispatch = useDispatch();
  let currentUser = useSelector(state => state.getUser);
  let AttendanceMark = useSelector(state => state.AttendanceMark);
  let allUsers = useSelector(state => state.allUsers);
  let pages = useSelector(state => state.pageSlice);

  let [page, setPage] = useState(1);
  async function handleAttendance(isPresent){
    let isConfirm = window.confirm('Do you want to mark your attendance for today');
    if(isConfirm){
      await dispatch(markAttendance({id : currentUser?.data?.message?._id, isPresent : isPresent}));
    }
  }
  async function handleDel(id){
    let confirm = window.confirm('Do you want to delete this user');
    if(confirm){
      dispatch(deleteUser(id));
      dispatch(getUser());
    }
  }

  useEffect(()=>{
    if(!AttendanceMark.isLoading && AttendanceMark.data){
      toast[AttendanceMark?.data?.success ? 'success' : 'error'](`${AttendanceMark.data.message}`, {
        position: "top-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        
      dispatch(clearData());
     
    }  
  },[dispatch, AttendanceMark])

  
  useEffect(() =>{
    if(currentUser?.data?.message?.role == 'admin'){
      if(!allUsers?.data){
        dispatch(getAllUsers(page));
      }
    }
  },[])

  useEffect(() => {
    dispatch(getAllUsers(pages.page));
  },[pages.page])

  let totals = allUsers?.data?.totals;
  let perPage = allUsers?.data?.perPage;
  let totalPages = totals / perPage ;
  let currentPage = pages.page;

  if(currentUser?.data?.message?.role == 'admin'){
    if(!allUsers?.data?.message){
      return <div>No data available</div>
    }
  }

  return (
    <div className="flex flex-col mt-3 w-screen">
        {
          currentUser?.data?.message?.role == 'admin' ? (
          <section className='admin-section w-full'>
            <div className="text-center text-2xl font-semibold">Users</div>
              <table className="styled-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Roll no</th>
                        <th>Attendance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {
                    allUsers?.data?.message?.length <= 0 && allUsers?.data?.message ? (
                      <tr>
                        <td>No Students Available</td>
                      </tr>
                    ) : (
                      allUsers?.data?.message?.map((item, index) =>{
                       return (<tr key={item?._id} className="active-row">
                          <td><Link to={`/view-attendance/${item?._id}`}>{item?.name}</Link></td>
                          <td>{item?.rollNo}</td>
                          <td>{item?.AttendacePercentage}%</td>
                          <td className='flex justify-center gap-x-3 flex-wrap'>
                            <Link to={`/update-user/${item?._id}`} className='main-btn'>Edit</Link>
                            <button onClick={() => handleDel(item._id)} className='main-btn del'>Del</button>
                            <Link className='main-btn view' to={`/view-attendance/${item?._id}`}>Attendance</Link>
                          </td>
                        </tr>)
                      })
                    )
                  }
                </tbody>
              </table>
              <div className='flex w-full justify-end gap-x-5'>
                  <button disabled={currentPage <= 1}   onClick={() => dispatch(pageNo(pages.page - 1) )} className='main-btn'><FontAwesomeIcon icon={faBackward} /></button>
                  <button  disabled={currentPage >= totalPages} onClick={() => dispatch(pageNo(pages.page + 1) )} className='main-btn'><FontAwesomeIcon icon={faForward} /></button>
              </div>    
          </section>
          ) :  (
           <section className='user-section w-full'>
            <div className="text-center text-2xl font-semibold">Today Attendance</div>
              <div className='flex justify-center w-screen mt-10 gap-x-6'>
                <button onClick={() => handleAttendance(true)} className="main-btn">Present</button>
                <button onClick={() => handleAttendance(false)} className="main-btn del">Absent</button>
                <Link to={'/student-view-attendance'} className="main-btn view">View Previous Attendances</Link>
                <Link to={'/make-request'} className="main-btn">Leave Request</Link>
              </div>
           </section>
          )
        }
    </div>
  )
}

export default Home