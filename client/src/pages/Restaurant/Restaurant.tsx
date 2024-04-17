import React, { useEffect } from 'react'
import styles from './Restaurant.module.scss'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { getPlacesAround, getPlacesAroundByOrderId } from '../../redux/features/order/orderApi'
import { FakeHeader } from '../../components/Header/FakeHeader/FakeHeader'
import { PlacesAroundType } from '../../types/PlacesAroundType'
import { RestaurantsCard } from '../../components/RestaurantsCard/RestaurantsCard'
import { setStyles } from '../../redux/features/header/headerSlice'
import { useParams } from 'react-router-dom'

export const Restaurant: React.FC = () => {
  const { order, places } = useAppSelector(state => state.order)
  const { orderID } = useParams<{ orderID: string }>()

  const dispatch = useAppDispatch()
  useEffect(() => {
    if (order._id) {
      dispatch(
        getPlacesAround({
          lng: order.address.lng,
          lat: order.address.lat,
          radius: 2000,
          type: 'restaurants',
        })
      )
    } else if (orderID) {
      dispatch(getPlacesAroundByOrderId({ orderID, radius: 2000, type: 'restaurants' }))
    }
  }, [order])

  useEffect(() => {
    dispatch(
      setStyles({
        scrolledBackground: 'black',
        scrolledColor: 'white',
        background: '#2c2c2c',
        color: 'white',
      })
    )
  }, [])

  return (
    <div className={styles.restaurant}>
      <FakeHeader />
      <div className={styles.restaurant_container}>
        {places.length ? (
          places.map((place: PlacesAroundType, index: number) => {
            return <RestaurantsCard key={index} place={place} />
          })
        ) : (
          <h1>There are not any restaurants near you.</h1>
        )}
      </div>
    </div>
  )
}
