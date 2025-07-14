import React from 'react'

export default function ErrorMessage({children}:{children: React.ReactNode}) {
  return (
    <p className="mt-2 border border-red-500 px-2 text-red-500"> {children} </p>
  )
}
