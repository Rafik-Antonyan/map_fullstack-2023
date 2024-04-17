import React from 'react'
import { OrderFood } from '../../components/OrderFood/OrderFood'
import { OrderContextProvider } from '../../context/OrderContext'
import styles from './Home.module.scss'

export const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <div className={styles.home_first}>
        <OrderContextProvider>
          <OrderFood />
        </OrderContextProvider>
      </div>
    </div>
  )
}
