import React, { useEffect, useLayoutEffect, useState } from 'react'
import styles from './OrderFood.module.scss'
import { FakeSelect } from '../FakeSelect/FakeSelect'
import { FakeSelectType } from '../../types/FakeSelectType'
import { BiSolidTime } from 'react-icons/bi'
import { IoIosArrowDown } from 'react-icons/io'
import { BsFillCalendarEventFill } from 'react-icons/bs'
import { Button } from '../Button/Button'
import Modal from '../Modal/Modal'
import { GoogleMapComponent } from '../GoogleMap/GoogleMapComponent'
import { CoordinatesType } from '../../types/CoordinatesType'
import { useOrderContext } from '../../context/OrderContext'
import { AddressType, OrderDetailsType, OrderTypeFront } from '../../types/OrderDetailsType'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { newOrder } from '../../redux/features/order/orderApi'
import { setStyles } from '../../redux/features/header/headerSlice'
import { formatingTimeFromBack } from '../../utils/time/formatingTimeFromBack'
import { MapInput } from '../Input/MapInput'
import { AddressLIst } from '../Addresses/AddressLIst'

export const OrderFood: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.user)
  const { order, setOrder }: OrderDetailsType = useOrderContext()
  const [address, setAddress] = useState<string>('')
  const [selectedCoordinate, setSelectedCoortinate] = useState<CoordinatesType | null>(null)
  const [isMapModalOpened, setIsMapModalOpened] = useState<boolean>(false)
  const data: FakeSelectType[] = [
    {
      leftIcon: <BiSolidTime />,
      text: 'Deliver now',
      rightIcon: <IoIosArrowDown />,
    },
    {
      leftIcon: <BsFillCalendarEventFill />,
      text: 'Schedule for later',
      rightIcon: <IoIosArrowDown />,
    },
  ]
  const [deliverType, setDeliveryType] = useState<FakeSelectType>(data[0])
  const [isAddressesListOpened, setIsAddressesListOpened] = useState<boolean>(false)
  const [selectedAddress, setSelectedAddress] = useState<AddressType>({} as AddressType)

  useLayoutEffect(() => {
    dispatch(setStyles({ background: 'transparent' }))
  }, [])

  useEffect(() => {
    setOrder((prev: OrderTypeFront) => ({
      time:
        deliverType.text !== 'Deliver now'
          ? prev.time
          : formatingTimeFromBack({
              start: new Date(Date.now() + 20 * 60 * 1000),
              end: new Date(Date.now() + 50 * 60 * 1000),
            }),
      address: {
        name: address,
        lat: selectedCoordinate?.lat,
        lng: selectedCoordinate?.lng,
      },
    }))
  }, [selectedCoordinate?.lat, selectedCoordinate?.lng, deliverType, address])

  const addOrder = () => {
    if (!user.email) {
      navigate('/sign/login')
      toast('At first please login.')

      return
    }
    for (const key in order.address) {
      if (!order.address[key as keyof AddressType]) {
        toast.error('Please fill all fields for order')

        return
      }
    }
    dispatch(newOrder(order))
      .unwrap()
      .then(resp => {
        navigate('/restaurant/' + resp.data._id)
      })
  }

  useEffect(() => {
    if (selectedAddress.name) {
      setAddress(selectedAddress.name)
      setSelectedCoortinate({ lat: selectedAddress.lat, lng: selectedAddress.lng })
    }
  }, [selectedAddress])

  return (
    <div className={styles.orderFood}>
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
      <h1>Order food to your door</h1>
      <div className={styles.orderFood_container}>
        {isAddressesListOpened && (
          <Modal
            onClose={() => setIsAddressesListOpened(false)}
            children={
              <AddressLIst
                selectable={true}
                addresses={user.addresses}
                selected={selectedAddress}
                setSelected={setSelectedAddress}
                setModalState={setIsAddressesListOpened}
              />
            }
          />
        )}
        <div className={styles.orderFood_container_address}>
          {!!user.addresses?.length && (
            <Button
              onClick={() => setIsAddressesListOpened(true)}
              children='Choose from your list.'
              height='20px'
              background='green'
              color='white'
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
        </div>
        <FakeSelect width='200px' data={data} value={deliverType} setValue={setDeliveryType} />
        <Button
          background='black'
          children={<h3>Find Food</h3>}
          width='120px'
          height='60px'
          color='white'
          borderRadius='12px'
          onClick={addOrder}
        />
      </div>
    </div>
  )
}
