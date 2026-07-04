import React, { useContext } from 'react'
import { assets } from '../dashboardAssets/assets.js'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import LogoutConfirmModal from '../components/LogoutConfirmModal'

const Navbar = () => {

  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  const confirmLogout = () => {
    setShowLogoutModal(false)
    logout()
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <p onClick={() => navigate('/')} className='text-lg font-semibold text-primary cursor-pointer hidden sm:block'>CareConnect</p>
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
      <button onClick={() => setShowLogoutModal(true)} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        title='Confirm logout'
        message='Are you sure you want to log out from this dashboard?'
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  )
}

export default Navbar