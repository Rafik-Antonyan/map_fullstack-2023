import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface HeaderState {
  background?: string
  color?: string
  scrolledColor?: string
  scrolledBackground?: string
}

const initialState: HeaderState = {
  background: '',
  color: '',
  scrolledColor: '',
  scrolledBackground: '',
}

export const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setStyles(
      state,
      action: PayloadAction<{
        background?: string
        color?: string
        scrolledColor?: string
        scrolledBackground?: string
      }>
    ) {
      state.background = action.payload.background
      state.color = action.payload.color
      state.scrolledBackground = action.payload.scrolledBackground
      state.scrolledColor = action.payload.scrolledColor
    },
  },
})

export const { setStyles } = headerSlice.actions

export default headerSlice.reducer
