import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { updateOrderStatus } from '../../redux/features/order/orderApi'
import styles from './SavedPaymentCardModal.module.scss'
import { CardType } from '../../types/CardType'
import { failureGif, masterCardPng, successGif, visaCardPng } from '../../assets'
import { Button } from '../Button/Button'
import { AiOutlineArrowLeft } from 'react-icons/ai'

interface ISavedPaymentCardModal {
  customerID: string
  price: number
  onClose: CallableFunction
}

export const SavedPaymentCardModal: React.FC<ISavedPaymentCardModal> = ({ customerID, price, onClose }) => {
  const dispatch = useAppDispatch()
  const [status, setStatus] = useState<string>('in proccess')
  const { orders } = useAppSelector(state => state.order)
  const { user } = useAppSelector(state => state.user)
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)

  const payWithSavedCard = (index: number) => {
    dispatch(
      updateOrderStatus({
        customerID,
        amount: price,
        orders,
        cardId: user.cards?.[index].id!,
        card: user.cards?.[index],
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
  }

  return (
    <>
      {
        {
          'in proccess': (
            <div className={styles.savedPaymentCardModal}>
              <AiOutlineArrowLeft className={styles.savedPaymentCardModal_arrow} onClick={() => onClose()} />{' '}
              <h1>Saved Payment Methods</h1>
              {user.cards?.length ? (
                user.cards.map((card: CardType, index: number) => {
                  return (
                    <div
                      key={index}
                      className={styles.savedPaymentCardModal_container}
                      onClick={() => setSelectedCardIndex(index)}
                      style={
                        selectedCardIndex === index ? { border: '2px solid #3abc8a' } : { border: '1px solid #7c7c7c' }
                      }
                    >
                      <div className={styles.savedPaymentCardModal_container_image}>
                        <input
                          type='radio'
                          onChange={() => setSelectedCardIndex(index)}
                          checked={index === selectedCardIndex}
                          id={`cards+${index}`}
                          name='cards'
                        />
                        <label htmlFor={`cards+${index}`} />
                        <img src={card.brand === 'MasterCard' ? masterCardPng : visaCardPng} />
                      </div>
                      <div className={styles.savedPaymentCardModal_container_cardInfo}>
                        <p className={styles.savedPaymentCardModal_container_cardInfo_numbers}>
                          **** **** **** {card.last4}
                        </p>
                        <p>{card.brand}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p>You don't have saved cards.</p>
              )}
              <Button
                onClick={() => payWithSavedCard(selectedCardIndex!)}
                background='#0D8549'
                color='white'
                borderRadius='12px'
                height='30px'
              >
                Pay
              </Button>
            </div>
          ),
          success: <img src={successGif} alt='success' />,
          failed: <img src={failureGif} alt='failure' />,
        }[status]
      }
    </>
  )
}
