import React, { useEffect, useState } from 'react'
import { Order, Order2, OrderFromBack, TimeFromBack } from '../../types/OrderDetailsType'
import styles from './Tip.module.scss'
import { Button } from '../Button/Button'
import Modal from '../Modal/Modal'
import { Payment } from '../../pages/Payment/Payment'

interface ITip {
  orders: OrderFromBack<TimeFromBack>[]
}

export const Tip: React.FC<ITip> = ({ orders }) => {
  const [order, setOrder] = useState<Order2[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false)

  useEffect(() => {
    setTotalPrice(0)
    if (orders.length) {
      const orderArray: Order2[] = []
      orders.forEach((order: OrderFromBack<TimeFromBack>) => {
        order.orders.forEach((singleOrder: Order) => {
          singleOrder.order.forEach((single: Order2) => {
            orderArray.push(single)
            setTotalPrice(prev => prev + single.count * single.price)
          })
        })
      })
      setOrder(orderArray)
    }
  }, [orders])

  return (
    <div className={styles.tip}>
      <div className={styles.tip_header}>
        <h2>Your Order Tip</h2>
      </div>
      <div className={styles.tip_main}>
        <div className={styles.tip_main_order}>
          <div>
            <h4>Order Summary</h4>
          </div>
          <div className={styles.tip_main_order_container}>
            {order.map((order: Order2, index: number) => {
              return (
                <div key={index} className={styles.tip_main_order_container_line}>
                  <div className={styles.tip_main_order_container_line_left}>{order.name}</div>
                  <div className={styles.tip_main_order_container_line_right}>X {order.count}</div>
                </div>
              )
            })}
          </div>
        </div>
        <div className={styles.tip_main_order}>
          <div>
            <h4>Cost Summary</h4>
          </div>
          <div className={styles.tip_main_order_container}>
            <div className={styles.tip_main_order_container_line}>
              <div className={styles.tip_main_order_container_line_left}>Order</div>
              <div className={styles.tip_main_order_container_line_right}>֏{totalPrice}</div>
            </div>
            <div className={styles.tip_main_order_container_line}>
              <div className={styles.tip_main_order_container_line_left}>Delivery</div>
              <div className={styles.tip_main_order_container_line_right}>{totalPrice > 6000 ? 'Free' : '֏500'}</div>
            </div>
            <div className={styles.tip_main_order_container_line}>
              <div className={styles.tip_main_order_container_line_left}>Total</div>
              <div className={styles.tip_main_order_container_line_right}>
                ֏{totalPrice > 6000 ? totalPrice : totalPrice + 500}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.tip_footer}>
        <Button background='rgb(76, 166, 168)' height='50px' onClick={() => setOpenPaymentModal(true)}>
          Go for a payment
        </Button>
      </div>
      {openPaymentModal && (
        <Modal
          onClose={() => setOpenPaymentModal(false)}
          children={
            <Payment
              price={totalPrice > 6000 ? totalPrice : totalPrice + 500}
              onClose={() => setOpenPaymentModal(false)}
            />
          }
        />
      )}
    </div>
  )
}
