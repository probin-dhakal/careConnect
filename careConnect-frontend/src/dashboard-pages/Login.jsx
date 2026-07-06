import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import PasswordField from '../components/PasswordField'

const Login = () => {

  const [state, setState] = useState('Admin')
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const navigate = useNavigate()

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true)

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })

        if (data.success) {
          setAToken(data.token)
          localStorage.setItem('aToken', data.token)
        } else {
          toast.error(data.message)
        }

      } else {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })

        if (data.success) {
          setDToken(data.token)
          localStorage.setItem('dToken', data.token)
        } else {
          toast.error(data.message)
        }

      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }

  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center px-4'>
      <div className='m-auto w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center'>
        <div className='hidden md:flex flex-col gap-4 text-[#5E5E5E]'>
          <p className='text-4xl font-semibold text-primary leading-tight'>Welcome back to CareConnect.</p>
          <p className='text-sm leading-6 max-w-md'>Log in to manage appointments, update doctor availability, and keep the dashboard running smoothly.</p>
          <div className='flex flex-col gap-3 text-sm'>
            <p className='flex items-center gap-2'><span className='w-2 h-2 rounded-full bg-primary'></span>Manage bookings from one place</p>
            <p className='flex items-center gap-2'><span className='w-2 h-2 rounded-full bg-primary'></span>Track appointments and status updates</p>
            <p className='flex items-center gap-2'><span className='w-2 h-2 rounded-full bg-primary'></span>Simple access for admin and doctor accounts</p>
          </div>
        </div>

        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-white'>
          <div className='w-full text-center mb-2'>
            <p className='text-2xl font-semibold'><span className='text-primary'>{state}</span> Login</p>
            <p className='mt-2 text-sm'>Access the {state.toLowerCase()} dashboard to continue managing CareConnect.</p>
          </div>

          <button
            type='button'
            onClick={() => navigate('/')}
            className='w-full border border-primary text-primary py-2 rounded-md text-sm font-medium hover:bg-[#F2F3FF] transition-colors'
          >
            Back to main site
          </button>

          <div className='w-full '>
            <p>Email</p>
            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1 outline-primary' type="email" required />
          </div>
          <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} className='bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {
            state === 'Admin'
              ? <p>Doctor login? <span onClick={() => setState('Doctor')} className='text-primary underline cursor-pointer'>Switch here</span></p>
              : <p>Admin login? <span onClick={() => setState('Admin')} className='text-primary underline cursor-pointer'>Switch here</span></p>
          }
        </div>
      </div>
    </form>
  )
}

export default Login