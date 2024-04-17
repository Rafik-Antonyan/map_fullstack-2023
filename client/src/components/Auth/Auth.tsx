import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export const Auth: React.FC = () => {
  if (localStorage.getItem('token')) {
    return <Outlet />
  } else {
    return <Navigate to='/sign/login' />
  }
}
