import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import PasswordField from '../components/PasswordField'

const Login = () => {

  const [state, setState] = useState('Sign Up')
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true)

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }

      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }

      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center px-4'>
      <div className='m-auto w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center'>
        <div className='hidden md:flex flex-col gap-4 text-[#5E5E5E]'>
          <p className='text-4xl font-semibold text-primary leading-tight'>Manage your care with ease.</p>
          <p className='text-sm leading-6 max-w-md'>CareConnect keeps doctor bookings, health updates, and appointment tracking in one simple place.</p>
          <div className='flex flex-col gap-3 text-sm'>
            <p className='flex items-center gap-2'><span className='w-2 h-2 rounded-full bg-primary'></span>Quick sign up and secure login</p>
            <p className='flex items-center gap-2'><span className='w-2 h-2 rounded-full bg-primary'></span>Easy appointment booking</p>
            <p className='flex items-center gap-2'><span className='w-2 h-2 rounded-full bg-primary'></span>Track everything from one dashboard</p>
          </div>
        </div>

        <div className='flex flex-col gap-3 items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-white'>
          <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
          <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book your appointments and manage your profile.</p>
          {state === 'Sign Up'
            ? <div className='w-full '>
              <p>Full Name</p>
              <input onChange={(e) => setName(e.target.value)} value={name} className='border border-[#DADADA] rounded w-full p-2 mt-1 outline-primary' type="text" required />
            </div>
            : null
          }
          <div className='w-full '>
            <p>Email</p>
            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1 outline-primary' type="email" required />
          </div>
          <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} className='bg-primary text-white w-full py-2 my-2 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed'>
            {loading ? (state === 'Sign Up' ? 'Creating account...' : 'Logging in...') : (state === 'Sign Up' ? 'Create account' : 'Login')}
          </button>
          {state === 'Sign Up'
            ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
            : <p>Create a new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
          }
        </div>
      </div>
    </form>
  )
}

export default Login