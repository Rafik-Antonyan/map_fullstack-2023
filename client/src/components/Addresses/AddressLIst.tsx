import React from 'react'
import { AddressType } from '../../types/OrderDetailsType'
import { IoMdRemoveCircleOutline } from 'react-icons/io'
import styles from './Addresses.module.scss'
import { AiOutlineCheckCircle } from 'react-icons/ai'

interface IAddressLIst {
  addresses: AddressType[]
  showIcons?: boolean
  selectable?: boolean
  setSelected?: CallableFunction
  selected?: AddressType
  setModalState?: CallableFunction
}

export const AddressLIst: React.FC<IAddressLIst> = ({
  addresses,
  showIcons = false,
  selectable = false,
  setSelected,
  selected,
  setModalState,
}) => {
  return (
    <div className={styles.addresses_list}>
      {addresses.map((address: AddressType, index: number) => {
        return (
          <div
            className={styles.addresses_list_container}
            key={index}
            style={address.name === selected?.name ? { border: '1px solid green' } : { border: '1px solid black' }}
          >
            <p>{address.name}</p>
            {showIcons && (
              <div className={styles.addresses_list_container_icons}>
                <IoMdRemoveCircleOutline />
              </div>
            )}
            {selectable && selected && (
              <div className={styles.addresses_list_container_icons}>
                <AiOutlineCheckCircle
                  color={address.name === selected.name ? 'green' : 'black'}
                  onClick={() => {
                    setSelected!(address)
                    setModalState!(false)
                  }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
