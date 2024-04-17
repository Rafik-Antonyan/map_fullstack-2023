import { CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js'
import React from 'react'
import styles from './StripeCard.module.scss'

const CARD_OPTIONS: any = {
  style: {
    base: {
      letterSpacing: '0.42px',
      color: 'black',
      fontSize: '18px',
      ':-webkit-autofill': { color: 'black' },
      '::placeholder': { color: '#999999', fontWeight: 400, fontSize: '16px' },
    },
    invalid: {
      iconColor: '#ffc7ee',
      color: 'black',
    },
  },
}

export const StripeCard: React.FC = () => {
  return (
    <>
      <label htmlFor='numbers'>Card numbers</label>
      <div className={styles.inputs}>
        <CardNumberElement
          id='numbers'
          options={{
            ...CARD_OPTIONS,
            placeholder: 'Card numbers',
          }}
        />
      </div>
      <label htmlFor='expiration'>Card expiration</label>
      <div className={styles.inputs}>
        <CardExpiryElement
          id='expiration'
          options={{
            ...CARD_OPTIONS,
            placeholder: 'MM/YY',
          }}
        />
      </div>
      <label htmlFor='cvc'>Card CVC</label>
      <div className={styles.inputs}>
        <CardCvcElement id='cvc' options={{ ...CARD_OPTIONS, placeholder: 'CVC' }} />
      </div>
    </>
  )
}
