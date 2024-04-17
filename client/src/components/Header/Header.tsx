import React, { useEffect, useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { Button } from '../Button/Button'
import { BiSolidUser } from 'react-icons/bi'
import { LeftMenu } from './LeftMenu/LeftMenu'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../redux/store'
import styles from './Header.module.scss'

export const Header: React.FC = () => {
  const { user } = useAppSelector(state => state.user)
  const {
    color = 'black',
    background = 'transparent',
    scrolledColor = 'black',
    scrolledBackground = 'white',
  } = useAppSelector(state => state.header)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [immidetlyClose, setImmidetlyClose] = useState<boolean>(false)
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState<number>(0)

  useEffect(() => {
    setImmidetlyClose(false)
  }, [showMenu])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <div
        className={styles.header}
        style={scrollY === 0 ? { background, color } : { background: scrolledBackground, color: scrolledColor }}
      >
        <div className={styles.header_left}>
          <div className={styles.header_left_container}>
            <GiHamburgerMenu className={styles.header_left_container_icon} onClick={() => setShowMenu(true)} />
            <h1 onClick={() => navigate('/')}>
              <span>Testy</span> House
            </h1>
          </div>
        </div>
        <div className={styles.header_right}>
          <div className={styles.header_right_container}>
            {!user?.email && (
              <>
                <Button onClick={() => navigate('/sign/login')} background='white'>
                  <BiSolidUser className={styles.header_right_container_icon} />
                  Log in
                </Button>
                <Button
                  onClick={() => navigate('/sign/register')}
                  background='black'
                  color='white'
                  children='Sign up'
                />
              </>
            )}
          </div>
        </div>
      </div>
      <LeftMenu
        close={() => setShowMenu(false)}
        isOpen={showMenu}
        immidetlyClose={immidetlyClose}
        setImmidetlyClose={setImmidetlyClose}
        isLogged={user?.email ? true : false}
      />
      <Outlet />
    </>
  )
}
