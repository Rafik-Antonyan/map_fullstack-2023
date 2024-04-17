export type OrderDetailsType = {
  order: OrderTypeFront
  setOrder: CallableFunction
}

export type OrderTypeFront = {
  address: AddressType
  time: Time
}

export type OrderTypeBack = {
  address: AddressType
  time: TimeFromBack
}

export type AddressType = {
  lat: number
  lng: number
  name: string
}

export interface OrderFromBack<T> {
  time: T
  address: AddressType
  _id: string
  status: Status
  payment_method: string
  paid: boolean
  user_id: string
  orders: Order[]
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Status {
  text: string
  registration: number
  cooking: number
  delivery: number
}

export interface TimeFromBack {
  start: string
  end: string
}

export interface Time {
  day: string
  hour: string
}

export interface Order {
  name: string
  order: Order2[]
  _id: string
}

export interface Order2 {
  name: string
  count: number
  image: string
  price: number
  _id: string
}
