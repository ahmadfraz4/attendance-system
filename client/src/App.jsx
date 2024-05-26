import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"
import Login from "./pages/Login"
import Layout from "./components/Main"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";
import { getUser } from "./redux/slices/getuser.slice";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Loader from "./components/Loader";
import EditProfile from "./pages/EditProfile";
import DeleteProfile from "./pages/DeleteProfile";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import StudentViewAtt from "./pages/StudentViewAtt";
import MakeRequest from "./pages/MakeRequest";
import MyRequests from "./pages/MyRequests";
import ViewUserAtt from "./pages/admin/ViewUserAtt";
import LeaveRequests from "./pages/admin/LeaveRequests";
import UserApplication from "./pages/admin/UserApplication";
import EditUserProfile from "./pages/admin/EditUserProfile";
import AllReports from "./pages/admin/AllReports";
import UserReport from "./pages/admin/UserReport";
import AddUser from "./pages/admin/AddUser";
function App() {
    let dispatch = useDispatch();
    let currentUser = useSelector(state => state.getUser);
    // console.log(currentUser)

    useEffect(() =>{
      if(!currentUser.data){
        dispatch(getUser())
      }
    },[dispatch, currentUser])
  
  return (
    currentUser?.isLoading ? (
      <Loader />
    ) : (
    <Router>
            <Routes>
              <Route path="/" element={currentUser?.data?.success ?  <Layout> <Home /> </Layout> : <Login /> } />
              <Route path="/edit-profile" element={currentUser?.data?.success ?  <Layout> <EditProfile /> </Layout> : <Login /> } />
              <Route path="/delete-profile" element={currentUser?.data?.success ?  <Layout> <DeleteProfile /> </Layout> : <Login /> } />
              <Route path="/student-view-attendance" element={currentUser?.data?.success ?  <Layout> <StudentViewAtt /> </Layout> : <Login /> } />
              <Route path="/make-request" element={currentUser?.data?.success ?  <Layout> <MakeRequest /> </Layout> : <Login /> } />
              <Route path="/my-requests" element={currentUser?.data?.success && currentUser?.data?.message?.role != 'admin' ?  <Layout> <MyRequests /> </Layout> :  <Login /> }/>


              <Route path="/all-reports" element={currentUser?.data?.success && currentUser?.data?.message?.role == 'admin' ?  <Layout> <AllReports /> </Layout> : <Layout> <Home /> </Layout> } />
              <Route path="/add-user" element={currentUser?.data?.success && currentUser?.data?.message?.role == 'admin' ?  <Layout> <AddUser /> </Layout> : <Layout> <AddUser /> </Layout> } />
              <Route path="/user-report/:id" element={currentUser?.data?.success && currentUser?.data?.message?.role == 'admin' ?  <Layout> <UserReport /> </Layout> : <Layout> <Home /> </Layout> } />
              
              <Route path="/leave-requests" element={currentUser?.data?.success && currentUser?.data?.message?.role == 'admin' ?  <Layout> <LeaveRequests /> </Layout> : <Layout> <Home /> </Layout> } />
              <Route path="/view-attendance/:id" element={currentUser?.data?.success && currentUser?.data?.message?.role == 'admin' ?  <Layout> <ViewUserAtt /> </Layout> : <Layout> <Home /> </Layout> } />
              <Route path="/user-application/:id" element={currentUser?.data?.success && currentUser?.data?.message?.role == 'admin' ?  <Layout> <UserApplication /> </Layout> : <Layout> <Home /> </Layout> } />
              <Route path="/update-user/:id" element={currentUser?.data?.success && currentUser?.data?.message?.role == 'admin' ?  <Layout> <EditUserProfile /> </Layout> : <Layout> <Home /> </Layout> } />
              

              <Route path="/login" element={!currentUser?.data?.success ? <Login /> : <Layout> <Home /> </Layout> } />
              <Route path="/register" element={!currentUser?.data?.success ? <Register /> : <Layout> <Home /> </Layout> } />
              
              {/* <Route path="/login" element={ <Login />  } /> */}
              {/* <Route path="/register" element={<Register />} /> */}
            </Routes>
            <ToastContainer />
    </Router>
    )
    
  )
}

export default App