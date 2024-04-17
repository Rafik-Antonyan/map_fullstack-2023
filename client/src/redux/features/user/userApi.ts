import { createAsyncThunk } from '@reduxjs/toolkit'
import { UserType } from '../../../types/UserType'
import axios from '../../../utils/axios'
import { CoordinatesType } from '../../../types/CoordinatesType'
import { SignInputType } from '../../../components/SignForm/SignForm'

export const registerUser = createAsyncThunk('user/registerUser', async (userInfo: UserType, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/user/register', userInfo)
    if (data.token) {
      localStorage.setItem('token', data.token)
    }

    return data
  } catch (err: any) {
    return rejectWithValue(err?.response?.data)
  }
})

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/user/login', { email, password })
      if (data.token) {
        localStorage.setItem('token', data.token)
      }

      return data
    } catch (err: any) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const editUser = createAsyncThunk(
  'user/editUser',
  async ({ data }: { data: SignInputType[] }, { rejectWithValue }) => {
    try {
      const { data: info } = await axios.post('/user/edit', { data })

      return info
    } catch (err: any) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getMeUser = createAsyncThunk('user/getMeUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/user/me')

    if (data.token) {
      localStorage.setItem('token', data.token)
    }

    return data
  } catch (err: any) {
    return rejectWithValue(err?.response?.data)
  }
})

export const deleteUserCard = createAsyncThunk(
  'post/deleteUserCard',
  async ({ cardId }: { cardId: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/user/deleteUserCard', { cardId })

      return data
    } catch (err: any) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const addCard = createAsyncThunk(
  'post/addCard',
  async ({ customerID, source }: { customerID: string; source: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/user/addNewCard', { customerID, source })

      return data
    } catch (err: any) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const addNewAddresses = createAsyncThunk(
  'post/addNewAddress',
  async ({ address }: { address: CoordinatesType & { name: string } }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/user/addNewAddress', { address })

      return data
    } catch (err: any) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getClientSecret = createAsyncThunk('user/getClientSecret', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/user/clientSecret')

    return data
  } catch (err: any) {
    return rejectWithValue(err?.response?.data)
  }
})

export const verifyEmail = createAsyncThunk(
  'user/verifyEmail',
  async ({ _id }: { _id: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/user/verify', { _id })

      return data
    } catch (err: any) {
      return rejectWithValue(err?.response?.data)
    }
  }
)


export const checkIfUserVerified = createAsyncThunk(
  'user/checkIfUserVerified',
  async ({ _id }: { _id: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/user/checkIfUserVerified', { _id })

      return data
    } catch (err: any) {
      return rejectWithValue(err?.response?.data)
    }
  }
)
