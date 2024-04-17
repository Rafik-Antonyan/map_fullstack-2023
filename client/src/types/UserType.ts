import { CardType } from './CardType'
import { AddressType } from './OrderDetailsType'

export type UserType = {
  email: string
  password: string
  name: string
  surname: string
  _id: string
  customerID?: string
}

export type FullUserType = {
  email: string
  password: string
  name: string
  surname: string
  _id: string
  customerID?: string
  cards: CardType[]
  addresses: AddressType[]
  verified?: boolean
}
