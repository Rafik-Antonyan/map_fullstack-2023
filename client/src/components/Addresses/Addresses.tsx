import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { AddressType } from '../../types/OrderDetailsType'
import { MapInput } from '../Input/MapInput'
import { CoordinatesType } from '../../types/CoordinatesType'
import Modal from '../Modal/Modal'
import { GoogleMapComponent } from '../GoogleMap/GoogleMapComponent'
import { Button } from '../Button/Button'
import { addNewAddresses } from '../../redux/features/user/userApi'
import { AddressLIst } from './AddressLIst'
import styles from './Addresses.module.scss'
import useEnter from '../../hooks/useEnter'

interface IAddresses {
  showIcons?: boolean
}

export const Addresses: React.FC<IAddresses> = ({ showIcons = true }) => {
  const { user } = useAppSelector(state => state.user)
  const [addresses, setAddresses] = useState<AddressType[]>([])
  const [address, setAddress] = useState<string>('')
  const [selectedCoordinate, setSelectedCoortinate] = useState<CoordinatesType | null>(null)
  const [isMapModalOpened, setIsMapModalOpened] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setAddresses(user.addresses)
  }, [user._id, user.addresses])

  const addNewAddress = () => {
    if (selectedCoordinate && address) {
      dispatch(addNewAddresses({ address: { ...selectedCoordinate, name: address } }))
      setSelectedCoortinate(null)
      setAddress('')
    }
  }

  useEnter(addNewAddress)

  return (
    <div className={styles.addresses}>
      <h2>Your Addresses:</h2>
      <AddressLIst addresses={addresses} showIcons={showIcons} />
      <div className={styles.addresses_add}>
        {isMapModalOpened && (
          <Modal
            style={{ padding: '15px', background: '#ccc' }}
            children={
              <GoogleMapComponent
                selectedCoordinate={selectedCoordinate}
                setSelectedCoortinate={setSelectedCoortinate}
                setAddress={setAddress}
                width={'80vw'}
                height={'76vh'}
              />
            }
            onClose={() => setIsMapModalOpened(false)}
          />
        )}
        <MapInput
          address={address}
          isMapModalOpened={isMapModalOpened}
          selectedCoordinate={selectedCoordinate}
          setAddress={setAddress}
          setIsMapModalOpened={setIsMapModalOpened}
          setSelectedCoortinate={setSelectedCoortinate}
        />
        <Button
          children={'Add new address'}
          onClick={addNewAddress}
          disabled={selectedCoordinate && address ? false : true}
          height='35px'
          background='green'
          color='white'
        />
      </div>
    </div>
  )
}
