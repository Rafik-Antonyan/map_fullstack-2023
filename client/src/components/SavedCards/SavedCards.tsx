import React, { useEffect, useState } from 'react'
import { CardType } from '../../types/CardType'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { masterCardPng, visaCardPng } from '../../assets'
import { Button } from '../Button/Button'
import { AiOutlineClose } from 'react-icons/ai'
import { addCard, deleteUserCard, getClientSecret } from '../../redux/features/user/userApi'
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { StripeCard } from '../StripeCard/StripeCard'
import { stripePromise } from '../../pages/Payment/Payment'
import styles from './SavedCards.module.scss'

interface ICards {
  state: number
  setIsCardInputsOpened: CallableFunction
  setState:CallableFunction
}

const Cards: React.FC<ICards> = ({ state, setIsCardInputsOpened,setState }) => {
  const stripe = useStripe()!
  const elements = useElements()!
  const {
    user: { customerID },
  } = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()

  const addNewCard = async () => {
    // @ts-ignore
    const { error } = await stripe.createPaymentMethod({
      type: 'card',

      // @ts-ignore
      card: elements.getElement(CardCvcElement, CardExpiryElement, CardNumberElement),
    })

    if (!error) {
      const { source } = await stripe.createSource(

        // @ts-ignore
        elements.getElement(CardCvcElement, CardExpiryElement, CardNumberElement)
      )
      dispatch(addCard({ customerID: customerID!, source: source?.id! }))
      setIsCardInputsOpened(false)
      setState(0)
    }
  }

  useEffect(() => {
    if (!customerID) dispatch(getClientSecret())
    else if (state) addNewCard()
  }, [state, customerID])

  return <StripeCard />
}

export const SavedCards: React.FC = () => {
  const { user } = useAppSelector(state => state.user)
  const [isCardInputsOpened, setIsCardInputsOpened] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const [state, setState] = useState<number>(0)

  return (
    <div className={styles.savedCards}>
      {user.cards?.map((card: CardType, index: number) => {
        return (
          <div key={index} className={styles.savedCards_container}>
            <div className={styles.savedCards_container_image}>
              <img src={card.brand === 'MasterCard' ? masterCardPng : visaCardPng} />
            </div>
            <div className={styles.savedCards_container_cardInfo}>
              <div className={styles.savedCards_container_cardInfo_container}>
                <p className={styles.savedCards_container_cardInfo_container_numbers}>**** **** **** {card.last4}</p>
                <p>{card.brand}</p>
              </div>
              <AiOutlineClose
                className={styles.savedCards_container_cardInfo_remove}
                onClick={() => dispatch(deleteUserCard({ cardId: card.id }))}
              />
            </div>
          </div>
        )
      })}
      <hr />
      {isCardInputsOpened ? (
        <>
          <Elements stripe={stripePromise}>
            <Cards state={state} setIsCardInputsOpened={setIsCardInputsOpened} setState={setState}/>
          </Elements>
          <div className={styles.savedCards_buttons}>
            <Button
              onClick={() => setIsCardInputsOpened(false)}
              background='#a6a6a6'
              color='white'
              borderRadius='12px'
              height='30px'
            >
              Back
            </Button>
            <Button
              onClick={() => setState(prev => prev + 1)}
              background='#0D8549'
              color='white'
              borderRadius='12px'
              height='30px'
            >
              Add Card
            </Button>
          </div>
        </>
      ) : (
        <Button onClick={() => setIsCardInputsOpened(true)} color='white' borderRadius='12px' height='30px'>
          Add New Card
        </Button>
      )}
    </div>
  )
}
