import React, { RefObject } from 'react'
import { Input } from './Input'
import { TiLocation } from 'react-icons/ti'
import { BsFillCheckCircleFill, BsFillInfoCircleFill } from 'react-icons/bs'
import { CoordinatesType } from '../../types/CoordinatesType'
import { usePlacesWidget } from 'react-google-autocomplete'

interface IMapInput {
  address: string
  setAddress: CallableFunction
  selectedCoordinate: CoordinatesType | null
  isMapModalOpened: boolean
  setIsMapModalOpened: CallableFunction
  setSelectedCoortinate: CallableFunction
}

export const MapInput: React.FC<IMapInput> = ({
  address,
  setAddress,
  selectedCoordinate,
  isMapModalOpened,
  setIsMapModalOpened,
  setSelectedCoortinate,
}) => {
  const { ref }: { ref: RefObject<HTMLInputElement> } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    onPlaceSelected: (place: any) => {
      setAddress(place.formatted_address!)
      setSelectedCoortinate({
        lat: place.geometry?.location?.lat()!,
        lng: place.geometry?.location?.lng()!,
      })
    },
  })

  return (
    <Input
      ref={ref}
      width={'540px'}
      padding={{
        x: '24px',
        y: '16px',
      }}
      placeholder='Enter delivery address'
      value={address}
      setValue={setAddress}
      leftIcon={<TiLocation onClick={() => setIsMapModalOpened(!isMapModalOpened)} />}
      rightIcon={
        selectedCoordinate && address ? (
          <BsFillCheckCircleFill style={{ paddingRight: '2px', color: 'green' }} />
        ) : (
          <BsFillInfoCircleFill style={{ paddingRight: '2px' }} />
        )
      }
    />
  )
}
