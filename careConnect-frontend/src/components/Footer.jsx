import React from 'react'
import { assets } from '../publicAssets/assets.js'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

        <div>
          <div className='flex items-center gap-2 mb-4'>
            <p className='text-lg md:text-2xl font-semibold text-primary'>CareConnect</p>
          </div>
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>Book appointments, connect with trusted doctors, and manage your healthcare in one place.</p>
          <p className='mt-3 text-gray-500'>Fast support for patients, doctors, and admins.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+91 9876543210</li>
            <li>support@careconnect.com</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2024 @ CareConnect.com - All Right Reserved.</p>
      </div>

    </div>
  )
}

export default Footer
