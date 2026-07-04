import React, { useContext } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import UserNavbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Doctors from './pages/Doctors.jsx'
import Login from './pages/Login.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Appointment from './pages/Appointment.jsx'
import MyAppointments from './pages/MyAppointments.jsx'
import MyProfile from './pages/MyProfile.jsx'
import Verify from './pages/Verify.jsx'

import AdminNavbar from './dashboard-components/Navbar.jsx'
import Sidebar from './dashboard-components/Sidebar.jsx'
import AdminLogin from './dashboard-pages/Login.jsx'
import Dashboard from './dashboard-pages/Admin/Dashboard.jsx'
import AllAppointments from './dashboard-pages/Admin/AllAppointments.jsx'
import AddDoctor from './dashboard-pages/Admin/AddDoctor.jsx'
import DoctorsList from './dashboard-pages/Admin/DoctorsList.jsx'
import DoctorAppointments from './dashboard-pages/Doctor/DoctorAppointments.jsx'
import DoctorDashboard from './dashboard-pages/Doctor/DoctorDashboard.jsx'
import DoctorProfile from './dashboard-pages/Doctor/DoctorProfile.jsx'

import { AppContext } from './context/AppContext.jsx'
import { AdminContext } from './context/AdminContext.jsx'
import { DoctorContext } from './context/DoctorContext.jsx'

const adminRoutes = [
  '/admin',
  '/admin-dashboard',
  '/all-appointments',
  '/add-doctor',
  '/doctor-list',
  '/doctor-dashboard',
  '/doctor-appointments',
  '/doctor-profile',
]

const App = () => {
  const location = useLocation()
  const { token } = useContext(AppContext)
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  const isAdminArea = adminRoutes.includes(location.pathname)

  if (isAdminArea) {
    const hasAdminAccess = Boolean(aToken || dToken)
    const dashboardPath = aToken ? '/admin-dashboard' : '/doctor-dashboard'

    return (
      <div className='bg-[#F8F9FD] min-h-screen'>
        <ToastContainer />
        {hasAdminAccess ? (
          <>
            <AdminNavbar />
            <div className='flex items-start'>
              <Sidebar />
              <Routes>
                <Route path='/admin' element={<Navigate to={dashboardPath} replace />} />
                <Route path='/admin-dashboard' element={<Dashboard />} />
                <Route path='/all-appointments' element={<AllAppointments />} />
                <Route path='/add-doctor' element={<AddDoctor />} />
                <Route path='/doctor-list' element={<DoctorsList />} />
                <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
                <Route path='/doctor-appointments' element={<DoctorAppointments />} />
                <Route path='/doctor-profile' element={<DoctorProfile />} />
                <Route path='*' element={<Navigate to={dashboardPath} replace />} />
              </Routes>
            </div>
          </>
        ) : (
          <AdminLogin />
        )}
      </div>
    )
  }

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <UserNavbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/admin' element={<Navigate to={aToken ? '/admin-dashboard' : dToken ? '/doctor-dashboard' : '/admin'} replace />} />
        <Route path='*' element={<Navigate to={token ? '/' : '/'} replace />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
