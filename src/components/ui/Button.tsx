'use client'

import { useFormStatus } from 'react-dom'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingText?: string
}

export function SubmitButton({ children, pendingText = 'Učitavanje...', className = '', ...props }: Props) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending || props.disabled}
      className={`flex w-full justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      {...props}
    >
      {pending ? pendingText : children}
    </button>
  )
}
