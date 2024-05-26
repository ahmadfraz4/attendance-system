import { useDispatch, useSelector } from "react-redux";
import { hostName } from "../endpoints";
import { logoutUser } from "../redux/slices/login.slice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getUser } from "../redux/slices/getuser.slice";
import { faArrowRightFromBracket, faBell, faBullhorn, faEnvelope, faFlag, faGears, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Clock from '/clock.webp';
const Layout = ({ children }) => {
    let dispatch = useDispatch();
    let navigate = useNavigate();
    let monthsName = ['Jan', 'Feb', 'Mar', 'Apr', "May", "June", "July", "Aug", "September", "Octuber", "November", "December"];
    let currentUser = useSelector(state => state.getUser);
    async function handleLogout(){
        let confirmation = window.confirm('Do u want to logout?');
        if(confirmation){
            await dispatch(logoutUser());
            await dispatch(getUser());
            window.location.reload();
        }
    }

    useEffect(() => {
        if(!currentUser.data?.success){
            navigate('/login')
        }
    }, [navigate, currentUser])
    

  return (
        <div className="h-screen w-full bg-main-blue pb-10 relative flex overflow-hidden">

            <aside className="h-full w-16 flex flex-col items-center pt-7 relative bg-main-blue text-white">
                <Link to={'/'} className="logo text-3xl font-bold  mb-auto">
                    <img src={Clock} height={'50px'} width={'50px'} alt="" />
                </Link>   

               
                {
                currentUser?.data?.message?.role == 'admin' && 
                <Link to={'/add-user'} data-text="Add User"  className="h-10 w-10 tooltip flex tooltip mb-4 items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white focus:text-black">
                    <FontAwesomeIcon icon={faPlus} />
                </Link>
               }

               {
                currentUser?.data?.message?.role == 'admin' && 
                <Link to={'/all-reports'} data-text="All Reports" className="h-10 w-10 tooltip flex mb-4 items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white focus:text-black">
                    <FontAwesomeIcon icon={faFlag} />
                </Link>
               }

              
               
               
                <Link to={'/edit-profile'} data-text="Edit Profile" className="h-10 w-10 tooltip flex mb-4 items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white focus:text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                </Link>
                {
                    currentUser?.data?.message?.role == 'admin' ? 
                    <Link to={'/leave-requests'} data-text="Leave Requests" className="h-10 w-10 tooltip flex mb-4 items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white focus:text-black">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </Link> : 
                    <Link to={'/my-requests'} data-text="My Requests" className="h-10 w-10 tooltip flex mb-4 items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white focus:text-black">
                        <FontAwesomeIcon icon={faBullhorn} />
                    </Link>
                }

                <Link to={'/delete-profile'} data-text="Settings" className="h-10 w-10 tooltip flex mb-4 items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white focus:text-black">
                    <FontAwesomeIcon icon={faGears} />
                </Link>

            

                <div onClick={handleLogout} data-text="Logout" className="h-10 relative w-10 tooltip flex mb-4 items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white focus:text-black">
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </div>
            </aside>
            
            <div className="w-full h-full flex rounded-s-xl bg-off-white mt-7 overflow-hidden flex-col justify-between">
                    
                <header className="h-16 ps-5 w-full flex items-center bg-off-white relative justify-between pe-10  text-black">
                {
                    `Date : ${new Date(Date.now()).getDate()}-${monthsName[new Date(Date.now()).getMonth()]}-${new Date(Date.now()).getFullYear()}`
                }
                   <section className="flex">
                        <div className="h-100 me-3">
                            <img src={`${hostName}/public/temp/${currentUser?.data?.message?.profilePic}`} style={{height : '45px', width : '45px'}} className="rounded-full" alt="profilePic" />
                        </div>
                        <div className="flex flex-col items-start" style={{minWidth : '60px'}}>
                            <div className="text-md font-medium">{currentUser?.data?.message?.name }</div>
                            <div className="text-sm font-regular">Roll No : {currentUser?.data?.message?.rollNo}</div>
                        </div>
                   </section>
                </header>

                <main className="max-w-full h-full flex relative overflow-y-hidden">
                
                    <div className="h-full w-full m-4 pb-20 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-max gap-4 overflow-y-auto">
                        {children}
                    </div>
                </main>
            </div>

        </div>
  );
};

export default Layout;