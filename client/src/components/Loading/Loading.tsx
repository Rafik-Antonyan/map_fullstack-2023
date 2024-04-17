import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/store'
import styles from './Loading.module.scss'
import { burgerGif } from '../../assets'

export const Loading: React.FC = () => {
  const [userLoading, setUserLoading] = useState<boolean>(false)
  const [orderLoading, setOrderLoading] = useState<boolean>(false)
  const { isLoading: uLoading } = useAppSelector(state => state.user)
  const { isLoading: oLoading } = useAppSelector(state => state.order)

  useEffect(() => {
    setUserLoading(uLoading)
  }, [uLoading])

  useEffect(() => {
    setOrderLoading(oLoading)
  }, [oLoading])

  return (
    <div className={styles.loading} style={userLoading || orderLoading ? { zIndex: 200 } : { zIndex: -1 }}>
      {(userLoading || orderLoading) && <img src={burgerGif} alt='loading' />}
    </div>
  )
}
