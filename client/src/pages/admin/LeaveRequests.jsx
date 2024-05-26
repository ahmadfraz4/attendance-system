import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { allRequests } from '../../redux/slices/adminSlices/getAllRequest.slice';
import { hostName } from '../../endpoints';
import { Link } from 'react-router-dom';

function LeaveRequests() {
    let dispatch = useDispatch();
    let myreq = useSelector(state => state.getAllRequestSlice);
    useEffect(() => {
        if(!myreq?.data){
            dispatch(allRequests());
        }
    },[dispatch, myreq])
    let requests = myreq?.data;
    // console.log(myreq)
    return (
        myreq?.isLoading && !myreq.data ? <Loader /> :
        <section className='w-screen'>
            
            {
                !Array.isArray(requests?.message) || requests?.message?.length <= 0 ?
                <div>No request</div>
                :
                requests?.message?.map((item, index) =>{
                    
                    return (
                        <Link to={`/user-application/${item._id}`} key={item._id} className='card shadow-2xl mt-4 items-center'>
                            
                                <div className='flex gap-x-3'> 
                                    <img src={`${hostName}/public/temp/${item?.user?.profilePic}`} height={'30px'} width={'30px'} alt="profile" />
                                    <div className='ms-4'>{item?.user?.name}</div>
                                </div>
                                <div className={`${item?.approval != 'approved' ? 'main-btn del' : 'main-btn' }`}>
                                    {item?.approval}
                                </div>
                        </Link>
                    )
                })
            }
            
        </section>
    )
}

export default LeaveRequests