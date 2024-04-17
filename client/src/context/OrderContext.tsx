import React, { ReactNode, createContext, useContext, useState } from 'react'
import { OrderDetailsType, OrderTypeFront } from '../types/OrderDetailsType'

const OrderContext = createContext<OrderDetailsType>({} as OrderDetailsType)
export const OrderContextProvider = ({ children }: { children: ReactNode }) => {
  const [order, setOrder] = useState<OrderTypeFront>({} as OrderTypeFront)

  return <OrderContext.Provider value={{ order, setOrder }}>{children}</OrderContext.Provider>
}

export const useOrderContext = () => useContext(OrderContext)
