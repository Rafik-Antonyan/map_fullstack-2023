import React, { useEffect } from 'react'
import { Router } from './routes/Router'
import { useAppDispatch, useAppSelector } from './redux/store'
import { getMeUser } from './redux/features/user/userApi'
import { ToastContainer, toast } from 'react-toastify'
import { celarStatus } from './redux/features/user/userSlice'
import { Loading } from './components/Loading/Loading'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.user)
  useEffect(() => {
    if(!user._id){
      dispatch(getMeUser())
    }
  }, [user?._id])
  const { status } = useAppSelector(state => state.user)
  useEffect(() => {
    if (status) {
      toast(status)
      dispatch(celarStatus())
    }
  }, [status])

  return (
    <>
      <Router />
      <ToastContainer position='top-right' />
      <Loading />
    </>
  )
}

export default App
