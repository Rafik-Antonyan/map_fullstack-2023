import React from 'react'
import { Navigate, Outlet, useSearchParams } from 'react-router-dom'

export const Verified: React.FC = () => {
  const [searchParams] = useSearchParams()

  if (searchParams.get('first')) {
    return <Outlet />
  } else {
    return <Navigate to='/' />
  }
}
