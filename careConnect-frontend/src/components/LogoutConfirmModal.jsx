import React from 'react'

const LogoutConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4'>
      <div className='w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100'>
        <p className='text-xl font-semibold text-gray-800'>{title}</p>
        <p className='mt-2 text-sm leading-6 text-gray-600'>{message}</p>
        <div className='mt-6 flex items-center justify-end gap-3'>
          <button onClick={onCancel} className='rounded-full border border-gray-300 px-5 py-2 text-sm text-gray-600 hover:bg-gray-50'>
            No
          </button>
          <button onClick={onConfirm} className='rounded-full bg-primary px-5 py-2 text-sm text-white hover:opacity-90'>
            {confirmLabel || 'Yes, Logout'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutConfirmModal