import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { getOneUserAtt } from '../../redux/slices/attendanceSlices/get-one-user-att.slice'; 
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiEndpoint } from '../../endpoints';
import {clearRep, CreateReport} from '../../redux/slices/adminSlices/CreateReport';
import { allReports } from '../../redux/slices/adminSlices/getAllReports.slice';
function ViewUserAtt() {
  let params = useParams();  
  let dispatch = useDispatch();  
  let OneUserAtt = useSelector(state => state.OneUserAttendances);
  let createReport = useSelector(state => state.createReport);
  

  let [isDate, setIsDate] = useState(false);
  let [fromDate, setFromDate] = useState('');
  let [toDate, setToDate] = useState('');
  let [stillFrom, setStillFrom] = useState('');
  let [stillTo, setStillTo] = useState('');
  let [repName, setRepName] = useState('');
  let navigate = useNavigate(); 
  let [creating, setCreating] = useState(false);
  let [alert, setAlert] = useState(false);

  useEffect(() => {
    dispatch(getOneUserAtt({id : params.id}));
  },[])

  
  useEffect(()=>{
    if(!OneUserAtt?.data?.success){
      setIsDate(false);
      dispatch(getOneUserAtt({id : params.id}));
    }
  },[dispatch, params.id]);

  useEffect(() =>{
    if(createReport?.data?.success){
      toast[`${createReport?.data?.success ? 'success' : 'error'}`](`${createReport?.data?.success ? 'Report created !!' : 'SomeThing went wrong !! Try Later..' }`);
      dispatch(clearRep());
      dispatch(allReports())
    }
    
  },[dispatch, createReport])

  async function handleRepName(val){
    setRepName(val);
    let response = await fetch(`${apiEndpoint}/report/checkName`,{
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({name : val})
    });
    let jData = await response.json();
    setAlert(!jData.success)
  }

      async function saveReport(){
         if(alert){
          return 
         }
         let body = {};
         
         body.reportName = repName;
         body.fromDate = stillFrom && stillFrom != '' ? new Date(stillFrom) : new Date(OneUserAtt?.data?.message[0]?.user?.joinAt);
         body.toDate = stillTo && stillTo != '' ? new Date(stillTo) : new Date(Date.now());

         dispatch(CreateReport({id : params.id, body}))
         setCreating(false);
         setRepName('');
      }
      const [date, setDate] = useState(new Date());
   
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

        await dispatch(getOneUserAtt({id : params.id, body : {fromDate, tillDate : toDate}}));
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
        await dispatch(getOneUserAtt({id : params.id}));
      }


      if(OneUserAtt?.data?.message?.length <= 0){
        return <>No Data to show</>
      }
      // console.log(OneUserAtt?.data?.message[0]?.user.joinAt.toString().split('T')[0])
  return (
    
      OneUserAtt.isLoading  ? <Loader /> : (
        <div className='mt-3 flex flex-col w-screen justify-center items-center'>
          <div className="text-2xl font-bold mb-6 flex items-center gap-x-2">Attendance of <div className='text-red-400'>{OneUserAtt?.data?.message[0]?.user?.name}</div> is {OneUserAtt?.data?.attendancePercentage || OneUserAtt?.data?.message[0]?.user?.AttendacePercentage}%</div>
           <div className="flex flex-col w-full items-center">
            <form onSubmit={handelDates} className="flex mb-7 w-full flex-wrap gap-4">
              
              <div className=' flex items-center'> 
                <label htmlFor="from" className='me-5'>From</label>
                <input type="date" onChange={(e) => setFromDate(e.target.value)} value={fromDate} required min={`${OneUserAtt?.data?.message[0]?.user?.joinAt.toString().split('T')[0]}`} max={`${new Date().toISOString().split('T')[0]}`} className='input-field' name="from" id="from" />
              </div>
              <div className='flex items-center'>
                <label htmlFor="to" className='me-5'>To</label>
                <input type="date" onChange={(e) => setToDate(e.target.value)} value={toDate} required min={`${OneUserAtt?.data?.message[0]?.user?.joinAt.toString().split('T')[0]}`} max={`${new Date().toISOString().split('T')[0]}`} className='input-field' name="to" id="to" />
              </div>

              <button type='submit' className='main-btn py-1 ms-6 filter'>Apply Filter</button>  
              <button type='button' className='main-btn del ms-5' onClick={clearDates}>Clear filter</button>
              <button type='button' className='main-btn view ms-5' onClick={() => setCreating(!creating)}>{creating ? 'Cancel' :'Create Report' }</button>
              {
                creating && 
                <button  type='button' disabled={createReport?.isLoading} onClick={saveReport} className='main-btn ms-5' >
                  Save Report
                  {
                    createReport?.isLoading && 
                    <div className='loader ms-2'></div>
                  }
                </button>
              }
              {/* to={`/create-report/${OneUserAtt?.data?.message[0]?.user?._id}`} */}
            </form>
            {
              creating && <div className='my-4 w-4/4 sm:w-4/5 md:w-2/4'>
                <section className='flex justify-between w-full'>
                  <div className='font-bold'>Name of Report</div>
                  {
                    alert && 
                    <div className='text-red-500'>Name already taken</div>
                  }
                </section>
                <section>
                 <input type="text" value={repName} onChange={(e)=>handleRepName(e.target.value)} className='input-field' />
                </section>
              </div>
            }
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

export default ViewUserAtt