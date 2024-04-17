import React from 'react'
import { Marker } from '@react-google-maps/api'
import { CoordinatesType } from '../../types/CoordinatesType'

export const SelectedPlace: React.FC<{
  position: CoordinatesType
  icon: string
}> = ({ position, icon }) => {
  return (
    <>
      {Object.keys(position).length && (
        <Marker
          icon={{
            scaledSize: new window.google.maps.Size(90, 150),
            url: icon,
          }}
          position={position}
        />
      )}
    </>
  )
}
