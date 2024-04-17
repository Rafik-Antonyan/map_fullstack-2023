// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { getClientSecret } from '../../redux/features/user/userApi'
import styles from './Payment.module.scss'
import 'react-credit-cards-2/dist/es/styles-compiled.css'
import { Button } from '../../components/Button/Button'
import Modal from '../../components/Modal/Modal'
import { PaymentCardModal } from '../../components/PaymentCardModal/PaymentCardModal'
import { SavedPaymentCardModal } from '../../components/SavedPaymentCardModal/SavedPaymentCardModal'

export const stripePromise = loadStripe(
  'pk_test_51O01aSBqy0qWUc2GSmMqjECEmuRocE8dGT6AX8ou2teW9YuGRRCHbdSmkwtwIDynrnk0tI9hPgx2ra8stc5ESB4S0064PXbkIj'
)

interface ICheckoutForm {
  customerID: string
  price: number
  onClose: CallableFunction
}

const CheckoutForm: React.FC<ICheckoutForm> = ({ customerID, price, onClose }) => {
  const [openCardModal, setOpenCardModal] = useState<boolean>(false)
  const [openSavedCardModal, setSavedOpenCardModal] = useState<boolean>(false)

  return (
    <div>
      <div className={styles.card_container}>
        <h1>Payment</h1>
        <div className={styles.card_container_buttons}>
          <Button
            background='#313552'
            height='50px'
            onClick={() => setSavedOpenCardModal(true)}
            borderRadius='12px'
            color='white'
          >
            Saved Cards
          </Button>
          <Button
            background='rgb(86, 186, 198)'
            height='50px'
            onClick={() => setOpenCardModal(true)}
            borderRadius='12px'
            color='black'
            border='2px solid #999999'
          >
            Pay with card
          </Button>
          {openCardModal && (
            <Modal
              onClose={() => {
                setOpenCardModal(false)
                onClose()
              }}
            >
              <PaymentCardModal customerID={customerID} price={price} onClose={() => setOpenCardModal(false)} />
            </Modal>
          )}
          {openSavedCardModal && (
            <Modal
              onClose={() => {
                setSavedOpenCardModal(false)
                onClose()
              }}
            >
              <SavedPaymentCardModal
                customerID={customerID}
                price={price}
                onClose={() => setSavedOpenCardModal(false)}
              />
            </Modal>
          )}
        </div>
      </div>
    </div>
  )
}

interface IPayment {
  price: number
  onClose: CallableFunction
}

export const Payment: React.FC<IPayment> = ({ price, onClose }) => {
  const dispatch = useAppDispatch()
  const { customerID } = useAppSelector(state => state.order)
  useEffect(() => {
    dispatch(getClientSecret())
  }, [])

  return (
    <div className={styles.payment}>
      <Elements stripe={stripePromise}>
        <CheckoutForm customerID={customerID} price={price} onClose={onClose} />
      </Elements>
    </div>
  )
}
