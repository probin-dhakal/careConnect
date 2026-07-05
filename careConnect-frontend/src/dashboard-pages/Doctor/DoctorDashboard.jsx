import React from 'react'
import { useContext } from 'react'
import { useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../dashboardAssets/assets.js'
import { AppContext } from '../../context/AppContext'
import LogoutConfirmModal from '../../components/LogoutConfirmModal'

const DoctorDashboard = () => {

  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)
  const [pendingAppointmentId, setPendingAppointmentId] = useState(null)


  useEffect(() => {

    if (dToken) {
      getDashData()
    }

  }, [dToken])

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{currency} {dashData.earnings}</p>
            <p className='text-gray-400'>Earnings</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p></div>
        </div>
      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
              {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
              <img className='rounded-full w-10' src={item.userData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                <p className='text-gray-600 '>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled
                ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                  : <div className='flex'>
                    <img onClick={() => { setPendingAction('cancel'); setPendingAppointmentId(item._id); setConfirmOpen(true) }} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                    <img onClick={() => { setPendingAction('complete'); setPendingAppointmentId(item._id); setConfirmOpen(true) }} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                  </div>
              }
            </div>
          ))}
        </div>
            <LogoutConfirmModal isOpen={confirmOpen} title={pendingAction==='cancel'?'Cancel Appointment':'Mark Completed'} message={pendingAction==='cancel'?'Are you sure you want to cancel this appointment?':'Mark this appointment as completed?'} onCancel={() => setConfirmOpen(false)} onConfirm={async()=>{
              setConfirmLoading(true)
              if(pendingAction==='cancel') await cancelAppointment(pendingAppointmentId)
              else if(pendingAction==='complete') await completeAppointment(pendingAppointmentId)
              setConfirmLoading(false)
              setConfirmOpen(false)
              setPendingAction(null)
              setPendingAppointmentId(null)
            }} confirmLabel={pendingAction==='cancel'?'Yes, Cancel':'Yes, Complete'} loading={confirmLoading} />
      </div>

    </div>
  )
}

export default DoctorDashboard