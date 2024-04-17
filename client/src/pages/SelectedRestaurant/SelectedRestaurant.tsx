import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FakeHeader } from '../../components/Header/FakeHeader/FakeHeader'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { getSelectedPlaceDataById, getSuggestedPlacesAround, setOrder } from '../../redux/features/order/orderApi'
import { Loading } from '../../components/Loading/Loading'
import { setStyles } from '../../redux/features/header/headerSlice'
import { Rating } from 'react-simple-star-rating'
import { FaMapMarkerAlt, FaPhoneSquareAlt } from 'react-icons/fa'
import { AiFillCaretLeft, AiFillCaretRight, AiFillHome } from 'react-icons/ai'
import { MdTrolley } from 'react-icons/md'
import { PlacesAroundType } from '../../types/PlacesAroundType'
import { RestaurantsCard } from '../../components/RestaurantsCard/RestaurantsCard'
import Modal from '../../components/Modal/Modal'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import { googleMapStyles } from '../../constants/googleMapStyles'
import { SelectedPlace } from '../../components/GoogleMap/SelectedPlace'
import { restaurantIcon } from '../../assets'
import { ContactsModal } from '../../components/Modal/Contacts/ContactsModal'
import { CarouselComponent } from '../../components/CarouselComponent/CarouselComponent'
import styles from './SelectedRestaurant.module.scss'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader

export const SelectedRestaurant: React.FC = () => {
  const navigate = useNavigate()
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const { placeID, orderID } = useParams<{
    placeID: string
    orderID: string
  }>()
  const { selectedPlace } = useAppSelector(state => state.order)
  const [activeDotIndex, setActiveDotIndex] = useState<number>(0)
  const dispatch = useAppDispatch()
  const { suggestedPlaces, isLoading } = useAppSelector(state => state.order)
  const [numOfSwipe, setNumOfSwipe] = useState<number>(0)
  const [isMapOpenModal, setIsMapOpenModal] = useState<boolean>(false)
  const [isContactsOpenModal, setIsContactsOpenModal] = useState<boolean>(false)

  useEffect(() => {
    dispatch(setStyles({ background: '#000', color: 'white' }))
  }, [])

  useEffect(() => {
    if (placeID) dispatch(getSelectedPlaceDataById({ place_id: placeID }))
    setNumOfSwipe(0)
    setActiveDotIndex(0)
  }, [placeID])

  useEffect(() => {
    if (selectedPlace.geometry)
      dispatch(
        getSuggestedPlacesAround({
          lat: selectedPlace.geometry.location.lat,
          lng: selectedPlace.geometry.location.lng,
          radius: 2000,
          type: 'restaurants',
        })
      )
  }, [selectedPlace])

  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
  })

  const containerStyle: { width: string; height: string } = {
    width: '80vw',
    height: '76vh',
  }

  return (
    <div className={styles.selectedRestaurant}>
      {!isLoading && selectedPlace?.place_id ? (
        <>
          <FakeHeader />
          <div className={styles.selectedRestaurant_container}>
            <div className={styles.selectedRestaurant_container_left}>
              <div className={styles.selectedRestaurant_container_left_images}>
                <img
                  className={styles.selectedRestaurant_container_left_images_main}
                  src={selectedPlace.photos[selectedImageIndex]}
                />
                <div className={styles.selectedRestaurant_container_left_images_container}>
                  {selectedPlace.photos.map((photo: string, index: number) => {
                    return <img onMouseEnter={() => setSelectedImageIndex(index)} src={photo} key={index} />
                  })}
                </div>
              </div>
              <div className={styles.selectedRestaurant_container_left_week}>
                <ul>
                  {selectedPlace?.opening_hours.weekday_text.map((day: string, index: number) => {
                    const splited: string[] = day.split(' ')

                    return (
                      <li key={index}>
                        {splited.map((text: string, ind: number) => {
                          return <p key={ind}>{text}</p>
                        })}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
            <div className={styles.selectedRestaurant_container_info}>
              <div className={styles.selectedRestaurant_container_info_desc}>
                <h1>{selectedPlace?.name}</h1>
                <h3>
                  <Rating initialValue={selectedPlace?.rating} allowFraction={true} readonly={true} />(
                  {selectedPlace?.utc_offset})
                </h3>
                <p>{selectedPlace?.formatted_address}</p>
              </div>
              <div className={styles.selectedRestaurant_container_info_reviews}>
                <h1>What our Clients say</h1>
                <div className={styles.selectedRestaurant_container_info_reviews_container}>
                  <AiFillCaretLeft
                    className={styles.selectedRestaurant_container_info_reviews_container_icons}
                    onClick={() => setActiveDotIndex(prev => prev - 1)}
                  />
                  <CarouselComponent
                    data={selectedPlace}
                    activeDotIndex={activeDotIndex}
                    numOfSwipe={numOfSwipe}
                    setActiveDotIndex={setActiveDotIndex}
                    setNumOfSwipe={setNumOfSwipe}
                  />
                  <AiFillCaretRight
                    className={styles.selectedRestaurant_container_info_reviews_container_icons}
                    onClick={() => setActiveDotIndex(prev => prev + 1)}
                  />
                </div>
                <div className={styles.selectedRestaurant_container_info_reviews_dots}>
                  {selectedPlace?.reviews?.map((_, index: number) => {
                    return (
                      <div
                        onClick={() => setActiveDotIndex(index)}
                        className={
                          activeDotIndex === index
                            ? styles.selectedRestaurant_container_info_reviews_dots_active
                            : styles.selectedRestaurant_container_info_reviews_dots_dot
                        }
                        key={index}
                      />
                    )
                  })}
                </div>
              </div>
              <div className={styles.selectedRestaurant_container_info_icons}>
                <a href={selectedPlace?.website} target='__blank'>
                  <AiFillHome onClick={() => dispatch(setOrder({ id: orderID! }))} />
                </a>
                {isMapOpenModal && (
                  <Modal
                    children={
                      isLoaded ? (
                        <GoogleMap
                          mapContainerStyle={containerStyle}
                          center={selectedPlace?.geometry?.location}
                          zoom={18}
                          options={googleMapStyles}
                        >
                          <SelectedPlace icon={restaurantIcon} position={selectedPlace?.geometry?.location} />
                        </GoogleMap>
                      ) : (
                        <Loading />
                      )
                    }
                    onClose={() => setIsMapOpenModal(false)}
                  />
                )}
                <FaMapMarkerAlt onClick={() => setIsMapOpenModal(true)} />
                <MdTrolley onClick={() => navigate(`/restaurant/${orderID}`)} />
                <FaPhoneSquareAlt onClick={() => setIsContactsOpenModal(true)} />
                {isContactsOpenModal && (
                  <Modal
                    children={
                      <ContactsModal
                        international_phone_number={selectedPlace?.international_phone_number}
                        formatted_phone_number={selectedPlace?.formatted_phone_number}
                      />
                    }
                    onClose={() => setIsContactsOpenModal(false)}
                  />
                )}
              </div>
            </div>

            <div className={styles.selectedRestaurant_container_other}>
              {suggestedPlaces
                .filter(place => place.place_id !== selectedPlace?.place_id)
                .map((place: PlacesAroundType, index: number) => {
                  return <RestaurantsCard openStatus={false} place={place} key={index} />
                })}
            </div>
          </div>
          {/* @ts-ignore */}
          <marquee>
            We are JUST page for ordering, get more information about {selectedPlace?.name} in there{' '}
            <a target='__blank' href={selectedPlace?.website}>
              SITE.
            </a>
            {/* @ts-ignore */}
          </marquee>
        </>
      ) : (
        <Loading />
      )}
    </div>
  )
}
