import React, { useEffect, useState } from 'react'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import { googleMapStyles } from '../../constants/googleMapStyles'
import { CoordinatesType } from '../../types/CoordinatesType'
import { SelectedPlace } from './SelectedPlace'
import { markIcon } from '../../assets'

const center: CoordinatesType = {
  lat: 40.183333,
  lng: 44.516666999999984,
}

interface IGoogleMapComponent {
  width: string
  height: string
  selectedCoordinate: CoordinatesType | null
  setSelectedCoortinate: CallableFunction
  setAddress: CallableFunction
}

export const GoogleMapComponent: React.FC<IGoogleMapComponent> = React.memo(
  ({ width, height, selectedCoordinate, setSelectedCoortinate, setAddress }) => {
    const [currentLocation, setCurrentLocation] = useState<CoordinatesType | null>(null)

    const getCurrentCoordinates = (): void => {
      navigator.geolocation.getCurrentPosition((position): void => {
        const currentLocation: CoordinatesType = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setCurrentLocation(currentLocation)
        setSelectedCoortinate(currentLocation)
      })
    }

    useEffect(() => {
      if (!selectedCoordinate) {
        getCurrentCoordinates()
      } else {
        setCurrentLocation(selectedCoordinate)
      }
    }, [])

    useEffect(() => {
      new window.google.maps.Geocoder().geocode({ location: selectedCoordinate }, results => {
        setAddress(results?.[0].formatted_address || '')
      })
    }, [selectedCoordinate])

    const containerStyle: { width: string; height: string } = {
      width,
      height,
    }

    const { isLoaded } = useLoadScript({
      id: 'google-map-script',
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
    })

    const onMapClick = (e: any): void => {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()

      setSelectedCoortinate({ lat, lng })
    }

    return (
      <>
        {isLoaded && (
          <GoogleMap
            onClick={onMapClick}
            mapContainerStyle={containerStyle}
            center={currentLocation ? currentLocation : center}
            zoom={18}
            options={googleMapStyles}
          >
            <SelectedPlace
              icon={markIcon}
              position={selectedCoordinate ? selectedCoordinate : ({} as CoordinatesType)}
            />
          </GoogleMap>
        )}
      </>
    )
  }
)
