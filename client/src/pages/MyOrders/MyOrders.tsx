import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { getUserOrders } from '../../redux/features/order/orderApi'
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineFlag, AiOutlineLeft } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { Order, Order2, OrderFromBack, Time, TimeFromBack } from '../../types/OrderDetailsType'
import { Button } from '../../components/Button/Button'
import { Tip } from '../../components/Tip/Tip'
import { burgerSayingYesPng, courierSvg, emptyTrolleyGif, relaxingBurgerPng, trolleyPng } from '../../assets'
import { changeOrdersCount, removeFoodFromOrder } from '../../redux/features/order/orderSlice'
import styles from './MyOrders.module.scss'
import { formatingTimeFromBack } from '../../utils/time/formatingTimeFromBack'
import { LuChefHat } from 'react-icons/lu'
import { Line } from '../../components/Line/Line'
import io from 'socket.io-client'
import { BACKEND_URL } from '../../constants/backend'

export const MyOrders: React.FC = () => {
  const { user } = useAppSelector(state => state.user)
  const { orders } = useAppSelector(state => state.order)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [formattedOrders, setFormattedOrders] = useState<OrderFromBack<Time>[]>([])

  const formatter = ({ orders }: { orders: OrderFromBack<TimeFromBack>[] }) => {
    const formattedOrders: OrderFromBack<Time>[] = []
    orders.forEach(order => {
      formattedOrders.push({
        ...order,
        time: formatingTimeFromBack({
          start: new Date(order.time.start),
          end: new Date(order.time.end),
        }),
      })
    })

    setFormattedOrders(prev => {
      if (!prev.length) {
        return formattedOrders
      }

      return prev.map(elm => {
        const newOrder = formattedOrders.find(order => order._id === elm._id)
        if (newOrder) return newOrder

        return elm
      })
    })
  }

  useEffect(() => {
    const socket = io(BACKEND_URL)

    socket.on('updatingStatus', ({ orders }) => {
      formatter({ orders })
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    formatter({ orders })
  }, [orders])

  useEffect(() => {
    dispatch(getUserOrders(user._id))
  }, [user._id])

  const changeCount = (orderTimeIndex: number, restaurantIndex: number, foodIndex: number, num: number) => {
    dispatch(changeOrdersCount({ orderTimeIndex, restaurantIndex, foodIndex, num }))
  }

  return (
    <div className={styles.myOrders}>
      <div className={styles.myOrders_container} style={!formattedOrders.length ? { width: '100%' } : { width: '75%' }}>
        <div className={styles.myOrders_container_header}>
          <div className={styles.myOrders_container_header_left}>
            <AiOutlineLeft onClick={() => navigate(-1)} />
          </div>
          <div className={styles.myOrders_container_header_mid}>
            <h1>My Cart</h1>
          </div>
          <div></div>
        </div>
        <div className={styles.myOrders_container_section}>
          {formattedOrders.filter(order => order.orders.length).length ? (
            formattedOrders?.map((order: OrderFromBack<Time>, index: number) => {
              const activeIndex: number = Object.keys(order.status).findIndex(key => key === order.status.text)!

              return !order.orders.length ? (
                <div key={index} />
              ) : (
                <div className={styles.myOrders_container_section_restaurant} key={index}>
                  <h2 className={styles.myOrders_container_section_restaurant_text}>
                    {order.time.day} {order.status.text !== 'done' && `(${order.time.hour})`}{' '}
                    {order.status.text === 'done' ? (
                      <p style={{ paddingLeft: '15px', color: '#4ca6a8' }}>
                        <u>Delivered</u>
                      </p>
                    ) : (
                      <div className={styles.myOrders_container_section_restaurant_text_icons}>
                        <AiOutlineCheckCircle
                          className={
                            activeIndex > 0 || order.status.text === 'done'
                              ? styles.myOrders_container_section_restaurant_text_icons_active
                              : ''
                          }
                        />
                        <Line width={order.status.registration} showIndicator={order.status.text === 'registration'} />
                        <LuChefHat
                          className={
                            activeIndex > 1 || order.status.text === 'done'
                              ? styles.myOrders_container_section_restaurant_text_icons_active
                              : ''
                          }
                        />
                        <Line width={order.status.cooking} showIndicator={order.status.text === 'cooking'} />
                        <img
                          style={{
                            height: '35px',
                            width: '35px',
                            transform: 'scaleX(-1)',
                          }}
                          alt='courier'
                          src={courierSvg}
                          className={
                            activeIndex > 2 || order.status.text === 'done'
                              ? styles.myOrders_container_section_restaurant_text_icons_image
                              : ''
                          }
                        />
                        <Line width={order.status.delivery} showIndicator={order.status.text === 'delivery'} />
                        <AiOutlineFlag
                          className={
                            activeIndex > 3 || order.status.text === 'done'
                              ? styles.myOrders_container_section_restaurant_text_icons_active
                              : ''
                          }
                        />
                      </div>
                    )}
                  </h2>
                  {!!order.orders.length &&
                    order.orders.map((singleOrder: Order, ind: number) => {
                      return (
                        <div key={ind} className={styles.myOrders_container_section_restaurant_main}>
                          <h3 className={styles.myOrders_container_section_restaurant_main_text}>{singleOrder.name}</h3>
                          <div className={styles.myOrders_container_section_restaurant_main_section}>
                            {singleOrder.order.map((food: Order2, i: number) => {
                              return (
                                <div
                                  className={styles.myOrders_container_section_restaurant_main_section_contianer}
                                  key={i}
                                >
                                  {order.status.text === 'Not Registered' && (
                                    <AiOutlineCloseCircle
                                      onClick={() =>
                                        dispatch(
                                          removeFoodFromOrder({
                                            orderTimeIndex: index,
                                            restaurantIndex: ind,
                                            foodIndex: i,
                                          })
                                        )
                                      }
                                      className={
                                        styles.myOrders_container_section_restaurant_main_section_contianer_remove
                                      }
                                    />
                                  )}
                                  <div
                                    className={
                                      styles.myOrders_container_section_restaurant_main_section_contianer_image
                                    }
                                  >
                                    <img src={food.image} alt={food.name} />
                                  </div>
                                  <div
                                    className={styles.myOrders_container_section_restaurant_main_section_contianer_info}
                                  >
                                    <h4>{food.name}</h4>
                                    <p>֏{food.price}</p>
                                  </div>
                                  <div
                                    className={
                                      styles.myOrders_container_section_restaurant_main_section_contianer_count
                                    }
                                  >
                                    <div
                                      className={
                                        styles.myOrders_container_section_restaurant_main_section_contianer_count_container
                                      }
                                    >
                                      {order.status.text === 'Not Registered' ? (
                                        <Button
                                          disabled={food.count < 2}
                                          onClick={() => changeCount(index, ind, i, -1)}
                                        >
                                          -
                                        </Button>
                                      ) : (
                                        'Count'
                                      )}
                                      <p>{food.count}</p>
                                      {order.status.text === 'Not Registered' && (
                                        <Button onClick={() => changeCount(index, ind, i, 1)}>+</Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                </div>
              )
            })
          ) : (
            <div className={styles.myOrders_container_section_empty}>
              <div className={styles.myOrders_container_section_empty_container}>
                <img src={trolleyPng} alt='Empty trolley gif' />
                <h2>Empty trolley</h2>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.myOrders_tip}>
        <img src={relaxingBurgerPng} />
        <Tip orders={orders.filter(order => order.paid !== true && order.orders.length)} />
      </div>
      {!formattedOrders.filter(order => order.paid !== true && order.orders.length).length && (
        <div className={styles.myOrders_suggestion}>
          <img src={emptyTrolleyGif} alt='Empty trolley gif' />
          <h1>Do you wanna order something?</h1>
          <img alt='burgerSayingYesPng' src={burgerSayingYesPng} onClick={() => navigate('/')} />
        </div>
      )}
    </div>
  )
}
