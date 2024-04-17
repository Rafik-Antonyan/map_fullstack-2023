import React from 'react'
import styles from './ContactsModal.module.scss'
import { phonePng, viberPng, whatsAppPng } from '../../../assets'

interface IContactsModal {
  international_phone_number: string
  formatted_phone_number: string
}

export const ContactsModal: React.FC<IContactsModal> = ({ international_phone_number, formatted_phone_number }) => {
  return (
    <div className={styles.contacts}>
      <div className={styles.contacts_container}>
        <img src={phonePng} alt='phonePng' />
        <p>{formatted_phone_number}</p>
      </div>
      <div className={styles.contacts_container}>
        <img src={whatsAppPng} alt='whatsAppPng' />
        <p>{international_phone_number}</p>
      </div>
      <div className={styles.contacts_container}>
        <img src={viberPng} alt='viberPng' />
        <p>{international_phone_number}</p>
      </div>
    </div>
  )
}
