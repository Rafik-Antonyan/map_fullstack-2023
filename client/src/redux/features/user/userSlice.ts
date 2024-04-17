import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { FullUserType } from '../../../types/UserType'
import {
  addCard,
  addNewAddresses,
  deleteUserCard,
  editUser,
  getClientSecret,
  getMeUser,
  loginUser,
  registerUser,
  verifyEmail,
} from './userApi'
import { DataFromBackType } from '../../../types/DataFromBackType'
import { AddressType } from '../../../types/OrderDetailsType'
import { CardType } from '../../../types/CardType'

interface UserState {
  user: FullUserType
  token: string
  isLoading: boolean
  status?: string
}

const initialState: UserState = {
  user: {} as FullUserType,
  token: '',
  isLoading: false,
  status: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    celarStatus(state) {
      state.status = ''
    },
    logOut(state) {
      state.user = {} as FullUserType
      state.token = ''
      state.status = "You're logged out"
      localStorage.removeItem('token')
    },
  },
  extraReducers: builder => {
    builder.addCase(registerUser.pending, state => {
      state.isLoading = true
      state.status = 'Registrating...'
    })
    builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<DataFromBackType<FullUserType>>) => {
      state.isLoading = false
      state.status = action.payload.message!
      state.user = action.payload.data!
      state.token = action.payload.token!
    })
    builder.addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload.message
    })
    builder.addCase(loginUser.pending, state => {
      state.isLoading = true
      state.status = 'Login...'
    })
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<DataFromBackType<FullUserType>>) => {
      state.isLoading = false
      state.status = action.payload.message!
      state.user = action.payload.data!
      state.token = action.payload.token!
    })
    builder.addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload.message
    })
    builder.addCase(getMeUser.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getMeUser.fulfilled, (state, action: PayloadAction<DataFromBackType<FullUserType>>) => {
      state.isLoading = false
      state.status = action.payload.message!
      state.user = action.payload.data!
      state.token = action.payload.token!
    })
    builder.addCase(getMeUser.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload?.message
    })
    builder.addCase(deleteUserCard.pending, state => {
      state.isLoading = true
      state.status = 'Deleting card...'
    })
    builder.addCase(deleteUserCard.fulfilled, (state, action: PayloadAction<DataFromBackType<string>>) => {
      state.isLoading = false
      state.status = action.payload.message!
      state.user.cards = state.user.cards?.filter(card => card.id !== action.payload.data)
    })
    builder.addCase(deleteUserCard.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload?.message
    })
    builder.addCase(addNewAddresses.pending, state => {
      state.isLoading = true
      state.status = 'Adding new address...'
    })
    builder.addCase(addNewAddresses.fulfilled, (state, action: PayloadAction<DataFromBackType<AddressType>>) => {
      state.isLoading = false
      state.status = action.payload.message!
      state.user.addresses.push(action.payload.data!)
    })
    builder.addCase(addNewAddresses.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload?.message
    })
    builder.addCase(getClientSecret.pending, state => {
      state.isLoading = true
      state.status = 'Getting your client_secret.'
    })
    builder.addCase(getClientSecret.fulfilled, (state, action: PayloadAction<DataFromBackType<string>>) => {
      state.isLoading = false
      state.status = action.payload.message!
      state.user.customerID = action.payload.data!
    })
    builder.addCase(getClientSecret.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload?.message
    })
    builder.addCase(addCard.pending, state => {
      state.isLoading = true
      state.status = 'Adding new card.'
    })
    builder.addCase(addCard.fulfilled, (state, action: PayloadAction<DataFromBackType<CardType>>) => {
      state.isLoading = false
      state.status = action.payload.message!
      state.user.cards.push(action.payload.data!)
    })
    builder.addCase(addCard.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload?.message
    })
    builder.addCase(editUser.pending, state => {
      state.isLoading = true
      state.status = 'Editing...'
    })
    builder.addCase(editUser.fulfilled, (state, action: PayloadAction<DataFromBackType<FullUserType>>) => {
      state.isLoading = false
      state.status = action.payload.message!
      state.user = action.payload.data!
    })
    builder.addCase(editUser.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload?.message
    })
    builder.addCase(verifyEmail.pending, state => {
      state.isLoading = true
      state.status = 'Loading...'
    })
    builder.addCase(verifyEmail.fulfilled, (state, action: PayloadAction<DataFromBackType>) => {
      state.isLoading = false
      state.status = action.payload.message!
    })
    builder.addCase(verifyEmail.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload?.message
    })
  },
})

export const { celarStatus, logOut } = userSlice.actions

export const checkIsAuth = (state: { user: UserState }) => Boolean(state.user.token)

export default userSlice.reducer
