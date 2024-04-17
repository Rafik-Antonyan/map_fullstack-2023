import React, { useEffect } from 'react'
import { useAppDispatch } from '../../redux/store'
import { verifyEmail } from '../../redux/features/user/userApi'
import { Button } from '../../components/Button/Button'
import { verifiedPng } from '../../assets'
import styles from './VerifyEmail.module.scss'
import { useSearchParams } from 'react-router-dom'

export const VerifyEmail: React.FC = () => {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    dispatch(verifyEmail({ _id: searchParams.get('id')! }))
  }, [])

  return (
    <div className={styles.verifyEmail}>
      <div className={styles.verifyEmail_main}>
        <div className={styles.verifyEmail_main_container}>
          <img alt='verified' src={verifiedPng} />
          <h1>Verified!</h1>
          <p>You have verified your account</p>
          <Button
            children='Ok'
            background='#4574f7'
            color='white'
            onClick={() => window.close()}
            width='100px'
            height='40px'
          />
        </div>
      </div>
    </div>
  )
}
