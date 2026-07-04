import React, { useState } from 'react'

const EyeIcon = ({ hidden }) => (
  hidden ? (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' className='h-5 w-5'>
      <path d='M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z' />
      <path d='M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z' />
      <path d='M4 4l16 16' />
    </svg>
  ) : (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' className='h-5 w-5'>
      <path d='M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z' />
      <path d='M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z' />
    </svg>
  )
)

const PasswordField = ({ label = 'Password', value, onChange, placeholder = 'Password' }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className='w-full'>
      <p>{label}</p>
      <div className='mt-1 flex items-center rounded border border-[#DADADA] bg-white pr-2'>
        <input
          onChange={onChange}
          value={value}
          className='w-full rounded bg-transparent p-2 outline-primary'
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          required
        />
        <button
          type='button'
          onClick={() => setShowPassword(prev => !prev)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className='text-gray-500 hover:text-primary'
        >
          <EyeIcon hidden={!showPassword} />
        </button>
      </div>
    </div>
  )
}

export default PasswordField