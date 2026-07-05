import React from 'react'

const LogoutConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel, loading }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4'>
      <div className='w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100'>
        <p className='text-xl font-semibold text-gray-800'>{title}</p>
        <p className='mt-2 text-sm leading-6 text-gray-600'>{message}</p>
        <div className='mt-6 flex items-center justify-end gap-3'>
          <button disabled={loading} onClick={onCancel} className='rounded-full border border-gray-300 px-5 py-2 text-sm text-gray-600 hover:bg-gray-50'>
            No
          </button>
          <button disabled={loading} onClick={onConfirm} className='rounded-full bg-primary px-5 py-2 text-sm text-white hover:opacity-90 flex items-center gap-2'>
            {loading && (
              <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path>
              </svg>
            )}
            {confirmLabel || 'Yes, Logout'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutConfirmModal