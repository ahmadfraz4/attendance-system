import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { getOneUserAtt } from '../redux/slices/attendanceSlices/get-one-user-att.slice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
function StudentViewAtt() {
  let dispatch = useDispatch();  
  let OneUserAtt = useSelector(state => state.OneUserAttendances);
  let currentUser = useSelector(state => state.getUser);
  let [isDate, setIsDate] = useState(false);
  let [fromDate, setFromDate] = useState('');
  let [toDate, setToDate] = useState('');
  let [stillFrom, setStillFrom] = useState('');
  let [stillTo, setStillTo] = useState('');
  let navigate = useNavigate();  

  useEffect(() => {
    dispatch(getOneUserAtt({id : currentUser?.data?.message?._id}));
  },[])

  useEffect(() =>{
    if(OneUserAtt?.data?.message?.length <= 0){
      navigate('/')
    }
  },[OneUserAtt])
  
  useEffect(()=>{
    if(!OneUserAtt?.data?.success){
      setIsDate(false);
      dispatch(getOneUserAtt({id : currentUser?.data?.message?._id}));
    }
  },[dispatch, currentUser?.data?.message?._id]);
  
    const [date, setDate] = useState(new Date());
   
      // console.log(OneUserAtt?.data?.message[0].user?.joinAt);
      const tileClassName = ({ date: tileDate, view }) => {
        if (view === 'month') {

          const attendance = OneUserAtt?.data?.message.find((item) =>
            new Date(item.date).toDateString() === tileDate.toDateString()
          );

          if (tileDate.toDateString() == new Date(OneUserAtt?.data?.message[0]?.user?.joinAt).toDateString()) {
            return 'joinAt';
          }
          if(tileDate.getDay() == 0){
            return 'sunday'
          }
          
          if (attendance) {
            return attendance.isPresent ? 'present' : 'absent';
          } else {
            if (tileDate.toDateString() == new Date(OneUserAtt?.data?.message[0]?.user?.joinAt).toDateString()) {
              return 'joinAt';
            }else if(tileDate.getTime() > ( !isDate ? new Date(Date.now()).getTime() : new Date(stillTo).getTime() )){
              return '';
            }else if(new Date(tileDate).getTime(0,0,0,0) <= (!isDate ? new Date(OneUserAtt?.data?.message[0]?.user?.joinAt).getTime(23,59,59,999) : new Date(stillFrom).getTime(23,59,59,999)  )){
              return ''
            } else{
              return 'absent';
            }
          }
          
        }
        return null;
      };

      async function handelDates(e){
        e.preventDefault();
         if(new Date(fromDate).getTime(23,59,59,999) >= new Date(toDate).getTime(0,0,0,0)){
            toast.error(`from date must be less than to date`, {
            position: "top-right",
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
            return
         }

        await dispatch(getOneUserAtt({id : currentUser?.data?.message?._id, body : {fromDate, tillDate : toDate}}));
        setStillFrom(fromDate);
        setStillTo(toDate);
        setIsDate(true);
      }
     async function clearDates(){
        setStillFrom('');
        setStillTo('');
        setToDate('');
        setFromDate('');
        setIsDate(false);
       await dispatch(getOneUserAtt({id : currentUser?.data?.message?._id}));
      }
      
  return (
      OneUserAtt.isLoading && !OneUserAtt.data ? <Loader /> : (
        <div className='mt-3 flex flex-col w-screen justify-center items-center'>
          <div className="text-2xl font-bold mb-6">Your Attendance is {OneUserAtt?.data?.attendancePercentage || OneUserAtt?.data?.message[0]?.user?.AttendacePercentage}%</div>
           <div className="flex flex-col w-full items-center">
            <form onSubmit={handelDates} className="flex mb-7 w-full flex-wrap gap-4">
              
              <div className=' flex items-center'> 
                <label htmlFor="from" className='me-5'>From</label>
                <input type="date" onChange={(e) => setFromDate(e.target.value)} value={fromDate} required min={`${currentUser?.data?.message?.joinAt.toString().split('T')[0]}`} max={`${new Date().toISOString().split('T')[0]}`} className='input-field' name="from" id="from" />
              </div>
              <div className='flex items-center'>
                <label htmlFor="to" className='me-5'>To</label>
                <input type="date" onChange={(e) => setToDate(e.target.value)} value={toDate} required min={`${currentUser?.data?.message?.joinAt.toString().split('T')[0]}`} max={`${new Date().toISOString().split('T')[0]}`} className='input-field' name="to" id="to" />
              </div>

              <button type='submit' className='main-btn py-1 ms-6 filter'>Apply Filter</button>  
              <button type='button' className='main-btn del ms-5' onClick={clearDates}>Clear filter</button>
            </form>

            <Calendar
                onChange={setDate}
                value={date}
                tileClassName={tileClassName}
              />
           </div>
        </div>
      ) 
     
  )
}

export default StudentViewAtt