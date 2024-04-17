import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'
import { OrderFromBack, OrderTypeFront, TimeFromBack } from '../../../types/OrderDetailsType'
import { formatingTimeFromFront } from '../../../utils/time/formatingTimeFromFront'
import { formatingTimeFromBack } from '../../../utils/time/formatingTimeFromBack'

export const newOrder = createAsyncThunk('order/newOrder', async (orderDetail: OrderTypeFront, { rejectWithValue }) => {
  try {
    const { start, end } = formatingTimeFromFront(orderDetail.time)
    const { data } = await axios.post('/order/newOrder', {
      address: orderDetail.address,
      time: { start, end },
    })
    formatingTimeFromBack({ start, end })

    return data
  } catch (err: any) {
    return rejectWithValue(err?.response?.data)
  }
})

export const getPlacesAround = createAsyncThunk(
  'order/getPlacesAround',
  async (orderDetail: { lat: number; lng: number; radius: number; type: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/order/getPlacesAroundMe', orderDetail)

      return data
    } catch (err: any) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getPlacesAroundByOrderId = createAsyncThunk(
  'order/getPlacesAroundByOrderId',
  async (orderDetail: { orderID: string; radius: number; type: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/order/getPlacesAroundMeByOrderId', orderDetail)

      return data
    } catch (err: any) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getSelectedPlaceDataById = createAsyncThunk(
  'order/getSelectedPlaceDataById',
  async ({ place_id }: { place_id: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/order/getPlaceById', { place_id })

      return data.data.result
    } catch (err: any) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getSuggestedPlacesAround = createAsyncThunk(
  'order/getSuggestedPlacesAround',
  async (orderDetail: { lat: number; lng: number; radius: number; type: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/order/getPlacesAroundMe', orderDetail)

      return data
    } catch (err: any) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const setOrder = createAsyncThunk('order/setOrder', async (id: { id: string }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/order/setOrder', id)

    return data
  } catch (err: any) {
    return rejectWithValue(err?.response?.data)
  }
})

export const getUserOrders = createAsyncThunk('order/getUserOrders', async (id: string, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/order/getUserOrders', { id })

    return data
  } catch (err: any) {
    return rejectWithValue(err?.response?.data)
  }
})

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async (
    {
      card,
      source,
      customerID,
      amount,
      orders,
      cardId,
      userId,
    }: {
      cardId: string
      card: any
      source?: string
      customerID: string
      amount: number
      orders: OrderFromBack<TimeFromBack>[]
      userId?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post('/order/updateOrderStatus', {
        source,
        customerID,
        amount,
        card,
        orders,
        cardId,
        userId,
      })

      return data
    } catch (err: any) {
      return rejectWithValue(err?.response?.data)
    }
  }
)
