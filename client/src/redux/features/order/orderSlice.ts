import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import {
  getPlacesAround,
  getPlacesAroundByOrderId,
  getSelectedPlaceDataById,
  getSuggestedPlacesAround,
  getUserOrders,
  newOrder,
  setOrder,
  updateOrderStatus,
} from './orderApi'
import { DataFromBackType } from '../../../types/DataFromBackType'
import { PlacesAroundType } from '../../../types/PlacesAroundType'
import { OrderFromBack, TimeFromBack } from '../../../types/OrderDetailsType'
import { SelectedPlaceType } from '../../../types/SelectedPlaceType'
import { CardType } from '../../../types/CardType'

interface IOrderSlice {
  order: OrderFromBack<TimeFromBack>
  isLoading: boolean
  status: string
  places: PlacesAroundType[]
  selectedPlace: SelectedPlaceType
  suggestedPlaces: PlacesAroundType[]
  orders: OrderFromBack<TimeFromBack>[]
  cards: CardType[]
}

const initialState: IOrderSlice = {
  order: {} as OrderFromBack<TimeFromBack>,
  isLoading: false,
  status: '',
  places: [],
  selectedPlace: {} as SelectedPlaceType,
  suggestedPlaces: [],
  orders: [],
  cards: [],
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    changeOrdersCount: (
      state,
      action: PayloadAction<{
        orderTimeIndex: number
        restaurantIndex: number
        foodIndex: number
        num: number
      }>
    ) => {
      state.orders[action.payload.orderTimeIndex].orders[action.payload.restaurantIndex].order[
        action.payload.foodIndex
      ].count += action.payload.num
    },
    removeFoodFromOrder: (
      state,
      action: PayloadAction<{
        orderTimeIndex: number
        restaurantIndex: number
        foodIndex: number
      }>
    ) => {
      state.orders[action.payload.orderTimeIndex].orders[action.payload.restaurantIndex].order.splice(
        action.payload.foodIndex,
        1
      )

      if (!state.orders[action.payload.orderTimeIndex].orders[action.payload.restaurantIndex].order.length) {
        state.orders[action.payload.orderTimeIndex].orders.splice(action.payload.restaurantIndex, 1)
      }

      if (!state.orders[action.payload.orderTimeIndex].orders.length) {
        state.orders.splice(action.payload.orderTimeIndex, 1)
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(newOrder.pending, state => {
      state.isLoading = true
      state.status = 'Getting places around me.'
    })
    builder.addCase(
      newOrder.fulfilled,
      (state, action: PayloadAction<DataFromBackType<OrderFromBack<TimeFromBack>>>) => {
        state.isLoading = false
        state.status = action.payload.message!
        state.order = action.payload.data!
      }
    )
    builder.addCase(newOrder.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload?.message
    })
    builder.addCase(getPlacesAround.pending, state => {
      state.isLoading = true
      state.status = 'Getting places around me.'
    })
    builder.addCase(getPlacesAround.fulfilled, (state, action: PayloadAction<DataFromBackType<PlacesAroundType[]>>) => {
      state.isLoading = false
      state.status = action.payload.message!
      state.places = action.payload.data!
    })
    builder.addCase(getPlacesAround.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload?.message
    })
    builder.addCase(getPlacesAroundByOrderId.pending, state => {
      state.isLoading = true
      state.status = 'Getting places around me.'
    })
    builder.addCase(
      getPlacesAroundByOrderId.fulfilled,
      (state, action: PayloadAction<DataFromBackType<PlacesAroundType[]>>) => {
        state.isLoading = false
        state.status = action.payload.message!
        state.places = action.payload.data!
      }
    )
    builder.addCase(getPlacesAroundByOrderId.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload?.message
    })
    builder.addCase(getSelectedPlaceDataById.pending, state => {
      state.isLoading = true
      state.status = 'Getting places around me.'
    })
    builder.addCase(getSelectedPlaceDataById.fulfilled, (state, action: PayloadAction<SelectedPlaceType>) => {
      state.isLoading = false
      state.selectedPlace = action.payload
    })
    builder.addCase(getSelectedPlaceDataById.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload?.message
    })
    builder.addCase(getSuggestedPlacesAround.pending, state => {
      state.isLoading = true
      state.status = 'Getting places like your selected place.'
    })
    builder.addCase(
      getSuggestedPlacesAround.fulfilled,
      (state, action: PayloadAction<DataFromBackType<PlacesAroundType[]>>) => {
        state.isLoading = false
        state.suggestedPlaces = action.payload.data!
      }
    )
    builder.addCase(getSuggestedPlacesAround.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload?.message
    })
    builder.addCase(setOrder.pending, state => {
      state.isLoading = true
      state.status = 'Getting order from your selected restaurant.'
    })
    builder.addCase(
      setOrder.fulfilled,
      (state, action: PayloadAction<DataFromBackType<OrderFromBack<TimeFromBack>>>) => {
        state.isLoading = false
        state.order = action.payload.data!
        state.status = action.payload.message!
      }
    )
    builder.addCase(setOrder.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload?.message
    })
    builder.addCase(getUserOrders.pending, state => {
      state.isLoading = true
      state.status = 'Getting places like your selected place.'
    })
    builder.addCase(
      getUserOrders.fulfilled,
      (state, action: PayloadAction<DataFromBackType<OrderFromBack<TimeFromBack>[]>>) => {
        state.isLoading = false
        state.orders = action.payload.data!
        state.status = action.payload.message!
      }
    )
    builder.addCase(getUserOrders.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload?.message
    })
    builder.addCase(updateOrderStatus.pending, state => {
      state.isLoading = true
      state.status = 'Saving your order'
    })
    builder.addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<DataFromBackType<any>>) => {
      state.isLoading = false
      state.status = action.payload.message!
      state.cards.push(action.payload.data!)
      state.orders = action.payload.data.changedOrders
    })
    builder.addCase(updateOrderStatus.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.status = action.payload?.message
    })
  },
})

export const { changeOrdersCount, removeFoodFromOrder } = orderSlice.actions

export default orderSlice.reducer
