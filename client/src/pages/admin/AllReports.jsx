import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { hostName } from '../../endpoints';
import { Link } from 'react-router-dom';
import { allReports } from '../../redux/slices/adminSlices/getAllReports.slice';

function AllReports() {
    let dispatch = useDispatch();
    let allReport = useSelector(state => state.allReports);
    useEffect(() => {
        if(!allReport?.data){
            dispatch(allReports());
        }
    },[dispatch, allReport])
    let reports = allReport?.data;
    return (
        allReport?.isLoading && !allReport.data ? <Loader /> :
        <section className='w-full pb-52'>
            <div className="text-2xl text-center">
                Reports
            </div>
           <div className=' w-11/12 m-auto flex flex-col-reverse'>
            {
                    !Array.isArray(reports?.message) || reports?.message?.length <= 0 ?
                    <div>No request</div>
                    :
                    reports?.message?.map((item, index) =>{
                        
                        return (
                            <Link to={`/user-report/${item._id}`} key={item._id} className='card shadow-2xl mt-4 items-center'>
                                
                                    <div className='flex gap-x-3'> 
                                        <img src={`${hostName}/public/temp/${item?.user?.profilePic}`} height={'30px'} width={'30px'} alt="profile" />
                                        <div className='ms-4'>{item?.user?.name}</div>
                                    </div>
                                    <div className='font-bold'>{item?.reportName}</div>
                                    <div className={`main-btn`}>
                                        {new Date(item?.fromDate).toDateString()} --- {new Date(item?.toDate).toDateString()}
                                    </div>
                            </Link>
                        )
                    })
                }
           </div>
            
        </section>
    )
}

export default AllReports