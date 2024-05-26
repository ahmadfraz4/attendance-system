import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { getApplication } from '../../redux/slices/adminSlices/getApplication.slice';
import Loader from '../../components/Loader';
import { Approval, clearApp } from '../../redux/slices/adminSlices/Approval.slice';
import { toast } from 'react-toastify';
import { allRequests } from '../../redux/slices/adminSlices/getAllRequest.slice';

function UserApplication() {
    let params = useParams();
    let apply = useSelector(state => state.ApplicationSlice);
    let approved = useSelector(state => state.ApprovalSlice);
    let applyData = apply?.data?.message;
    
    let dispatch = useDispatch();

    async function handleApproval (val) {
        let isConfirm = window.confirm(`Do you want to ${val} this application`);
        if(isConfirm){
            dispatch(Approval({id : params.id, approval : val}))
        }
    }

    useEffect(() => {
        if(!apply?.data && params.id){
            dispatch(getApplication(params.id))
        }
    },[dispatch, params.id, apply])

    useEffect(() => {
        if(approved?.data){
            toast[`${approved?.data?.success ? 'success' : 'error' }`](`${approved?.data?.message}`);
            dispatch(clearApp());
            dispatch(allRequests());
        }
    },[approved, dispatch])

  return (
    apply?.isLoading && !apply?.data ? (
        <Loader />
    ) : (
        <div className='w-full'>
            <div className="text-2xl font-bold flex justify-between items-center flex-wrap">
                Application from {applyData?.user?.name} - {'{'} {applyData?.approval} {'}'}
                <section className='flex gap-x-4 text-sm items-center mt-2'>
                    <button onClick={() => handleApproval('approve')} className='main-btn'>Approve</button>
                    <button onClick={() => handleApproval('rejected')} className='main-btn del'>Reject</button>
                </section>
            </div>
            <div className="flex gap-x-5 items-center mt-4">
                <div className="text-2xl font-bold">For</div>
                {
                    applyData?.leaveDates.map((item, index) =>{
                        return <div key={index} className='main-btn'>{new Date(item).toDateString() }</div>
                    })
                }
            </div>
            <div className='border-2 border-black mt-5 py-3 bg-slate-300 px-3 rounded-xl'>
                   {
                    applyData?.application
                   } 
            </div>
        </div>
    )
  )
}

export default UserApplication