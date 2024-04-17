// @ts-nocheck
import React, { useState } from 'react'
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js'
import styles from './PaymentCardModal.module.scss'
import { Button } from '../Button/Button'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { updateOrderStatus } from '../../redux/features/order/orderApi'
import { failureGif, successGif } from '../../assets'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { StripeCard } from '../StripeCard/StripeCard'

interface IPaymentCardModal {
  customerID: string
  price: number
  onClose: CallableFunction
}

export const PaymentCardModal: React.FC<IPaymentCardModal> = ({ customerID, price, onClose }) => {
  const { orders } = useAppSelector(state => state.order)
  const [status, setStatus] = useState<string>('in proccess')
  const { user } = useAppSelector(state => state.user)
  const stripe = useStripe()!
  const elements = useElements()!
  const dispatch = useAppDispatch()
  const payment = async () => {
    const { error } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardCvcElement, CardExpiryElement, CardNumberElement),
    })

    if (!error) {
      const { source } = await stripe.createSource(
        elements.getElement(CardCvcElement, CardExpiryElement, CardNumberElement)
      )

      dispatch(
        updateOrderStatus({
          card: source.card,
          customerID,
          amount: price,
          source: source.id,
          orders,
          userId: user._id,
        })
      )
        .unwrap()
        .then(resp => {
          if (resp.message === 'Your payment was done successfully.') {
            setStatus('success')
          } else {
            setStatus('failed')
          }
        })
    } else {
      toast('Payment was failed')
      setStatus('failed')
    }
  }

  return (
    <div className={styles.card_container}>
      {
        {
          'in proccess': (
            <>
              <AiOutlineArrowLeft className={styles.card_container_arrow} onClick={() => onClose()} />
              <StripeCard />
              <Button onClick={() => payment()} background='#0D8549' color='white' borderRadius='12px' height='30px'>
                Pay
              </Button>
            </>
          ),
          success: <img src={successGif} alt='success' />,
          failed: <img src={failureGif} alt='failure' />,
        }[status]
      }
    </div>
  )
}
