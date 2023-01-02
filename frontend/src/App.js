import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import LoginScreen from './screens/LoginScreen';
import EmployeeDetails from './components/EmployeeDetails';
import AttendanceReport from './components/AttendanceReport';
import Screen404 from './screens/Screen404';
import ForgetPassword from './components/ForgetPassword';
import VerifyOtp from './components/VerifyOtp';
import ResetPassword from './components/ResetPassword';
import Events from './components/Events';
import { Calendar } from 'antd';


function App() {
  return (
    <div>

      <Router>
        <Routes>
          <Route exact path='/' element={<LoginScreen />} />
          <Route path='dashboard/' element={<Dashboard />} />
          <Route path='employee-details/' element={<EmployeeDetails />} />
          <Route path='attendance-report/' element={<AttendanceReport />} />
          <Route path='forgot-password' element={<ForgetPassword />} />
          <Route path='verify-otp' element={<VerifyOtp />} />
          <Route path='reset-password' element={<ResetPassword />} />
          <Route path='/events' element={<Events/>}/>
          <Route path='/calender' element={<Calendar />} />
          <Route path='*' element={<Screen404 />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
