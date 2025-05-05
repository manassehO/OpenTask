import { useMemo } from "react"

type Props = {
  value: number | undefined
  onChange: (value: number | undefined) => void
  maxLength: number
  label: string
  placeholder?: string
  error?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>

export default function OTPInput({
  value,
  onChange,
  maxLength,
  label,
  placeholder,
  error,
  ...props
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '') // remove non-digits
    if (input.length > maxLength) return
    const parsed = parseInt(input, 10)
    onChange(isNaN(parsed) ? undefined : parsed)
  }

  const errorText = useMemo(() => {
    const valueStr = value?.toString()
    if (valueStr && valueStr.length !== maxLength) return `OTP must be ${maxLength} digits`;
    return '-'
  }, [error])

  return (
    <label className="flex flex-col gap-2 text-base text-black">
      <span>{label}</span>
      <input
        {...props}
        type="text"
        inputMode="numeric"
        pattern="\d*"
        value={typeof value === 'number' ? value.toString() : ''}
        onChange={handleChange}
        maxLength={maxLength}
        placeholder={placeholder || 'Enter OTP'}
        required
        className={`border px-6 py-5 font-semibold rounded w-full ${error && 'border-red-500'}
        focus:outline-none focus:ring-2 focus:ring-black ${error && 'focus:ring-red-500'}
        ${props.className ?? ''}`}
      />
      <span className={`text-red-500 opacity-0 transition-opacity duration-300 ${error && 'opacity-100'}`}>
        {errorText}
      </span>
    </label>
  )
}