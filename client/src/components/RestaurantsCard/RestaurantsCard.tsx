import React from 'react'
import { PlacesAroundType } from '../../types/PlacesAroundType'
import { Rating } from 'react-simple-star-rating'
import styles from './RestaurantsCard.module.scss'
import { useNavigate, useParams } from 'react-router-dom'

interface IRestaurantsCard {
  place: PlacesAroundType
  openStatus?: boolean
}

export const RestaurantsCard: React.FC<IRestaurantsCard> = ({ place, openStatus = true }) => {
  const { orderID } = useParams<{
    orderID: string
  }>()
  const navigate = useNavigate()

  return (
    <div className={styles.restaurantsCard} onClick={() => navigate(`/restaurant/${orderID}/${place.place_id}`)}>
      <div className={styles.restaurantsCard_image}>
        <img src={place.photos} alt='' />
      </div>
      <div className={styles.restaurantsCard_info}>
        <div className={styles.restaurantsCard_info_left}>
          <div>
            <h1>{place.name}</h1>
            <Rating initialValue={place.rating} allowFraction={true} readonly={true} />
          </div>
          <p>{place.vicinity}</p>
        </div>
        {openStatus && (
          <div
            className={
              place.opening_hours.open_now
                ? styles.restaurantsCard_info_right_open
                : styles.restaurantsCard_info_right_close
            }
          >
            <p>{place.opening_hours.open_now ? 'OPEN' : 'CLOSE'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
