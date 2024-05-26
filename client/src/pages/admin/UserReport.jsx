import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { useDispatch, useSelector } from 'react-redux';
import { oneReport } from '../../redux/slices/adminSlices/UserReport.slice';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import { clearAction, deleteReport } from '../../redux/slices/adminSlices/deleteReport.slice';
import { allReports } from '../../redux/slices/adminSlices/getAllReports.slice';
import jsPDF from 'jspdf';
import * as htmlToImage from 'html-to-image';
import {LinkedinIcon, LinkedinShareButton, WhatsappIcon} from 'react-share'

function UserReport() {
    const [date, setDate] = useState(new Date());
    let params = useParams();
    let dispatch = useDispatch();
    let OneRep = useSelector(state => state.oneReport);
    let navigate = useNavigate('');
    let userReport = OneRep?.data?.message;

    useEffect(()=>{
        if(!OneRep?.data){
            dispatch(oneReport(params.id))
        }
    },[params.id, dispatch, OneRep])

    useEffect(()=>{
        dispatch(oneReport(params.id))
    },[params.id])
   

    const tileClassName = ({ date: tileDate, view }) => {
        if (view === 'month') {
      
          if (tileDate.getDay() === 0) {
            return 'sunday';
          }
      
          const tileDateAtMidnight = new Date(tileDate).setHours(0, 0, 0, 0);
          const fromDateAtMidnight = new Date(userReport?.fromDate).setHours(0, 0, 0, 0);
          const toDateAtEndOfDay = new Date(userReport?.toDate).setHours(23, 59, 59, 999);
      
          if (tileDateAtMidnight < fromDateAtMidnight) {
            return '';
          } else if (tileDateAtMidnight > toDateAtEndOfDay) {
            return '';
          } else {
            for (let i = 0; i < userReport?.statics?.length; i++) {
              let dat = userReport.statics[i];
              if (new Date(dat.date).setHours(0, 0, 0, 0) === tileDateAtMidnight) {
                return dat.label == 'p' ? 'present' : 'absent';
              }
            }
          }
        }
        return null;
    };

    async function handleRepDelete(){
        let isConfirm = window.confirm('Do you want to delete this report');
        if(isConfirm){
            await dispatch(deleteReport(params?.id))
            await dispatch(clearAction());
            await dispatch(allReports());
            navigate('/all-reports') 
        }
    }

    const handleShare = async () => {
      const element = document.getElementById('reportContent');
  
      // Convert HTML to Image
      const dataUrl = await htmlToImage.toPng(element);
  
      // Create a PDF from the Image
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('attendance-report.pdf');
    };


  if(OneRep?.isLoading){
    return <Loader />
  }  

  return (
    <div className='w-full flex flex-col items-center px-4' id='reportContent'>
        <div className='flex items-center w-full mb-4 mt-3 justify-between'>
          <div className="text-2xl font-bold">
            <div>Report name:- {userReport?.reportName}</div>
            <div>Student name:- {userReport?.user?.name}</div>
            <div>Roll No:- {userReport?.user?.rollNo}</div>
          </div>
          <section className='flex gap-x-3'>
            <LinkedinShareButton title='hy'  source={'https://www.linkedin.com/in/ahmad-fraz-2b087228b/'} />
            <button onClick={() => handleShare() } className='main-btn'>Generate Report</button>
            <button onClick={() => handleRepDelete() } className='main-btn del'>Delete Report</button>
          </section>    
        </div>
        <div className="text-2xl font-bold mt-3 mb-6 flex items-center flex-wrap gap-x-2">
              <div className=' text-red-500'> {userReport?.user?.name}</div>Report  for <div className='text-red-400 text-xl' >  {new Date(userReport?.fromDate).toDateString()} --  {new Date(userReport?.toDate).toDateString()}</div>
        </div>
        <Calendar
            onChange={setDate}
                value={date}
            tileClassName={tileClassName}
        />
        <div className="text-2xl font-bold mt-5 mb-6">
             Attendance Percentage {userReport?.attendancePercentage} %
        </div>
    </div>
  )
}

export default UserReport