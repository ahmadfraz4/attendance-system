import React, { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import { useDispatch, useSelector } from "react-redux";
import { makeRequest, clearData } from "../redux/slices/requestSlice/sendRequest";
import { toast } from "react-toastify";
function MakeRequest() {
  let dispatch = useDispatch();
  let isSend = useSelector(state => state.sendRequest)  
  const [dates, setDates] = useState([]);
  let [application, setApplication] = useState('');
  const handleDateChange = (selectedDates) => {
    setDates(selectedDates);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(makeRequest({application, leaveDates : dates}))
  };
  useEffect(()=>{
    if(!isSend.isLoading && isSend.data){
      toast[isSend?.data?.success ? 'success' : 'error'](`${isSend.data.message}`, {
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
  },[dispatch, isSend])
  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col w-screen gap-4">
      <div className="flex flex-col w-100">
        <label htmlFor="leave-dates">Select Leave Dates:</label>
        <DatePicker
            multiple
            value={dates}
            onChange={handleDateChange}
            id="leave-dates"
            minDate={new Date(Date.now())} 
            className="input-field"
        />
      </div>

       <textarea name="application" rows={6} placeholder="Write Application" className="input-field w-full" value={application} onChange={e => setApplication(e.target.value)} id=""></textarea> 

      <button type="submit" className="main-btn">Submit Leave Request</button>
    </form>
  );
}

export default MakeRequest;
