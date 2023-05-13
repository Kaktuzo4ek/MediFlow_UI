import './App.css';
import Login from './Pages/Login';
import ForgetPassword from './Pages/ForgetPassword';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import AmbulatoryEpisode from './Pages/AmbulatoryEpisode';
import AmbulatoryInteraction from './Pages/AmbulatoryInteraction';
import ViewAmbulatoryInteractions from './Pages/ViewAmbulatoryInteractions';
import ViewAppointmentReport from './Pages/ViewAppointmentReportInAmbulatory';
import ViewAmbulatoryEpisodeReport from './Pages/ViewAmpulatoryEpisodeReport';
import EditAppointment from './Pages/EditAmbulatoryInteractions/EditAppointment';
import ViewReferral from './Pages/ViewReferral';
import DiagnosticReports from './Pages/PatientBlock/DiagnosticReports';
import ViewProcedureInfo from './Pages/PatientBlock/Procedures/ViewProcedureInfo';
import ViewDiagnosticReportInfo from './Pages/PatientBlock/DiagnosticReports/ViewDiagnosticReportInfo';
import Hospitalization from './Pages/Hospitalization';
import Inpatients from './Pages/Inpatients';
import InpatientEpisode from './Pages/InpatientEpisode';
import InpatientInteractions from './Pages/InpatientInteractions';
import ViewInpatientInteractions from './Pages/ViewInpatientInteractions';
import EditInpatientAppointment from './Pages/EditInpatientInteractions/EditAppointment';
import ViewAppointmentReportInInpatient from './Pages/ViewAppointmentReportInInpatient';
import ViewInpatientEpisodeReport from './Pages/ViewInpatientEpisodeReport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='home' element={<Home />} />
        <Route path='/' element={<Navigate replace to='/home' />} />
        <Route path='confirmEmail' element={<ConfirmEmail />} />
        <Route path='login' element={<Login />} />
        <Route path='code' element={<RegisterEnterCode />} />
        <Route path='code/register' element={<Register />} />
        <Route path='resetPassword' element={<ResetPassword />} />
        <Route path='forgetPassword' element={<ForgetPassword />} />
        <Route path='doctor/profile-edit' element={<Profile />} />
        <Route path='doctor/main-page' element={<HomeDoctor />} />
        <Route path='doctor/hospital/doctors' element={<Doctors />} />
        <Route path='doctor/search-patient' element={<SearchPatient />} />
        <Route path='doctor/patient-procedures' element={<Procedures />} />
        <Route
          path='doctor/patient-procedures/view-info'
          element={<ViewProcedureInfo />}
        />
        <Route path='doctor/patient-referrals' element={<Referrals />} />
        <Route path='doctor/e-health/my-referrals' element={<MyReferrals />} />
        <Route
          path='doctor/e-health/search-referral'
          element={<SearchReferral />}
        />
        <Route
          path='doctor/head-doctor/manage-accounts'
          element={<ManageAccounts />}
        />
        <Route
          path='doctor/medical-events/patient-episodes'
          element={<AmbulatoryEpisode />}
        />
        <Route
          path='doctor/medical-events/inpatient-episodes'
          element={<InpatientEpisode />}
        />
        <Route
          path='doctor/medical-events/hospitalization'
          element={<Hospitalization />}
        />
        <Route
          path='doctor/medical-events/patient-episodes/view-report'
          element={<ViewAmbulatoryEpisodeReport />}
        />
        <Route
          path='doctor/medical-events/inpatient-episodes/view-report'
          element={<ViewInpatientEpisodeReport />}
        />
        <Route
          path='doctor/medical-events/patient-episodes/interactions'
          element={<AmbulatoryInteraction />}
        />
        <Route
          path='doctor/medical-events/patient-episodes/view-interactions'
          element={<ViewAmbulatoryInteractions />}
        />
        <Route
          path='doctor/medical-events/inpatient-episodes/interactions'
          element={<InpatientInteractions />}
        />
        <Route
          path='doctor/medical-events/inpatient-episodes/view-interactions'
          element={<ViewInpatientInteractions />}
        />
        <Route
          path='doctor/medical-events/patient-episodes/view-interactions/view-appointment-report'
          element={<ViewAppointmentReport />}
        />
        <Route
          path='doctor/medical-events/inpatient-episodes/view-interactions/view-appointment-report'
          element={<ViewAppointmentReportInInpatient />}
        />
        <Route
          path='doctor/medical-events/patient-episodes/view-interactions/view-appointments/edit-appointments'
          element={<EditAppointment />}
        />
        <Route
          path='doctor/medical-events/inpatient-episodes/view-interactions/view-appointments/edit-appointments'
          element={<EditInpatientAppointment />}
        />
        <Route path='doctor/view-referral' element={<ViewReferral />} />
        <Route
          path='doctor/patient-diagnostic-reports'
          element={<DiagnosticReports />}
        />
        <Route
          path='doctor/patient-diagnostic-reports/view-info'
          element={<ViewDiagnosticReportInfo />}
        />
        <Route path='doctor/inpatients' element={<Inpatients />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
