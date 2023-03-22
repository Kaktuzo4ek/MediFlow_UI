import './App.css';
import Login from './Pages/Login';
import ForgetPassword from './Pages/ForgetPassword';
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom";
import ConfirmEmail from './Pages/ConfirmEmail';
import ResetPassword from './Pages/ResetPassword';
import RegisterEnterCode from './Pages/RegisterEnterCode';
import Register from './Pages/Register';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import HomeDoctor from './Pages/HomeDoctor';
import Doctors from './Pages/Doctors';
import SearchPatient from './Pages/SearchPatient';
import Procedures from './Pages/PatientBlock/Procedures';
import Referrals from './Pages/PatientBlock/Referrals';
import MyReferrals from './Pages/MyReferrals';
import SearchReferral from './Pages/SearchReferral';
import ManageAccounts from './Pages/HeadDoctor/ManageAccounts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="home" element={<Home/>}/>
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="confirmEmail" element={<ConfirmEmail/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="code" element={<RegisterEnterCode/>}/>
        <Route path="code/register" element={<Register/>}/>
        <Route path="resetPassword" element={<ResetPassword/>}/>
        <Route path="forgetPassword" element={<ForgetPassword/>}/>
        <Route path="doctor/profile-edit" element={<Profile/>}/>
        <Route path="doctor/main-page" element={<HomeDoctor/>}/>
        <Route path="doctor/hospital/doctors" element={<Doctors/>}/>
        <Route path="doctor/search-patient" element={<SearchPatient/>}/>
        <Route path="doctor/patient-procedures" element={<Procedures/>}/>
        <Route path="doctor/patient-referrals" element={<Referrals/>}/>
        <Route path="doctor/e-health/my-referrals" element={<MyReferrals/>}/>
        <Route path="doctor/e-health/search-referral" element={<SearchReferral/>}/>
        <Route path="doctor/head-doctor/manage-accounts" element={<ManageAccounts/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
