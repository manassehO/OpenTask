'use client'
import { useState } from 'react'
import OTPInput from '../_components/form/OTPInput'

function Register() {
  const [otp, setOtp] = useState<number | undefined>(undefined)
  const [error, setError] = useState(false)
  const otpLength = 6

  const handleChange = (value: number | undefined) => {
    setOtp(value)
    setError(false)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // check otp length
    if (otp?.toString().length !== otpLength) {
      setError(true)
      return
    }
  }
  
  return (
    <div className='flex items-center justify-center w-full h-svh'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-96'>
        <OTPInput
          value={otp}
          onChange={(value) => handleChange(value as number | undefined)}
          maxLength={otpLength}
          label="OTP"
          placeholder="Enter OTP"
          error={error}
        />
        <button className='bg-[#3B82F6] text-white p-4 rounded-md'>Proceed</button>
      </form>
    </div>
  )
}

export default Register