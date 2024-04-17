import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import userSlice from './features/user/userSlice'
import orderSlice from './features/order/orderSlice'
import headerSlice from './features/header/headerSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    order: orderSlice,
    header: headerSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
