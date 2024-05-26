import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader';
import  {GetMyRequest} from '../redux/slices/requestSlice/get-myRequest';

function MyRequests() {
    let dispatch = useDispatch();
    let myreq = useSelector(state => state.getMyRequestSlice);
    
    useEffect(()=>{
        dispatch(GetMyRequest());
    },[]);
    
    useEffect(() => {
        if(!myreq?.data){
            dispatch(GetMyRequest());
        }
    },[dispatch, myreq])
    let requests = myreq?.data;


  return (
    myreq?.isLoading && !myreq.data ? <Loader /> :
    <section className='w-screen'>
        {
            !Array.isArray(requests?.message) ?
            <div>No request</div>
            :
            requests?.message?.map((item, index) =>{
                
                return (
                    <div key={index} className='card shadow-2xl mt-4 items-center'>
                        
                            <div className='flex gap-x-3'> 
                            {
                                item?.leaveDates?.map((dt) => {
                                    return <div key={dt}>{new Date(dt).toDateString()}</div>
                                })
                            }
                            </div>
                            <div className={`${item?.approval == 'rejected'  ? 'main-btn del' : 'main-btn' }`}>
                                {item?.approval}
                            </div>
                    </div>
                )
            })
        }
        
    </section>
  )
}

export default MyRequests