import React, { useContext, useEffect, useState } from 'react'
import LogoutConfirmModal from '../../components/LogoutConfirmModal'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const { doctors, changeAvailability , aToken , getAllDoctors, deleteDoctor } = useContext(AdminContext)
  const [deletingId, setDeletingId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  useEffect(() => {
    if (aToken) {
        getAllDoctors()
    }
}, [aToken])

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false)
    if (!selectedDoctor) return
    setDeletingId(selectedDoctor)
    await deleteDoctor(selectedDoctor)
    setDeletingId(null)
    setSelectedDoctor(null)
  }

  return (
    <>
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div className='relative border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
            <div className='p-4'>
              <div className='flex justify-between items-start'>
                <div>
                  <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                  <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedDoctor(item._id)
                    setShowDeleteModal(true)
                  }}
                  disabled={deletingId === item._id}
                  className='ml-2 p-2 rounded hover:bg-gray-100 text-red-600'
                >
                  {deletingId === item._id ? (
                    <span className='h-4 w-4 rounded-full border-2 border-red-600 border-t-transparent animate-spin block' />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22' />
                    </svg>
                  )}
                </button>
              </div>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <LogoutConfirmModal
      isOpen={showDeleteModal}
      title={'Confirm delete'}
      message={'Are you sure you want to delete this doctor?'}
      onConfirm={handleDeleteConfirm}
      confirmLabel={'Yes, Delete'}
      onCancel={() => setShowDeleteModal(false)}
    />
    </>
  )
}

export default DoctorsList