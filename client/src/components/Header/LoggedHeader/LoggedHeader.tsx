import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import { BiExit, BiSolidUserCircle } from 'react-icons/bi'
import {
  burgerBread1Image,
  burgerBread2Image,
  burgerCheeseImage,
  burgerMeatImage,
  burgerVegetablesImage,
} from '../../../assets'
import styles from './LoggedHeader.module.scss'
import { logOut } from '../../../redux/features/user/userSlice'
import { useNavigate } from 'react-router-dom'
import Modal from '../../Modal/Modal'
import { SavedCards } from '../../SavedCards/SavedCards'
import { Addresses } from '../../Addresses/Addresses'
import { Sign } from '../../../pages/Sign/Sign'

interface ILoggedHeader {
  isOpen: boolean
  close: CallableFunction
}

export const LoggedHeader: React.FC<ILoggedHeader> = ({ isOpen, close }) => {
  const { user } = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [witchModalIsOpened, setWitchModalIsOpened] = useState<string>('')

  useEffect(() => {
    setIsMenuOpen(false)
  }, [isOpen])

  return (
    <div className={styles.loggedHeader}>
      <div className={styles.loggedHeader_user}>
        <BiSolidUserCircle />
        <div className={styles.loggedHeader_user_info}>
          <h3>{user.name}</h3>
          <h4>{user.surname}</h4>
        </div>
        <div className={styles.loggedHeader_user_exit}>
          <BiExit onClick={() => dispatch(logOut())} />
        </div>
      </div>
      <div className={styles.loggedHeader_burger}>
        <div
          className={isMenuOpen ? styles.loggedHeader_burger_layers_open : styles.loggedHeader_burger_layers_close}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <img src={burgerBread1Image} />
          <img src={burgerVegetablesImage} />
          <img src={burgerCheeseImage} />
          <img src={burgerMeatImage} />
          <img src={burgerBread2Image} />
          <div
            className={styles.loggedHeader_burger_list}
            style={
              isMenuOpen
                ? { opacity: 1, transition: '2.1s', zIndex: 1 }
                : { opacity: 0, transition: '0.4s', zIndex: -1 }
            }
          >
            <ul>
              <li
                onClick={() => {
                  navigate('/orders')
                  close()
                }}
              >
                Orders
              </li>
              <li onClick={() => setWitchModalIsOpened('Settings')}>Settings</li>
              <li onClick={() => setWitchModalIsOpened('Addresses')}>Addresses</li>
              <li onClick={() => setWitchModalIsOpened('Cards')}>Cards</li>
            </ul>
          </div>
        </div>
      </div>
      <div></div>
      {witchModalIsOpened === 'Settings' && (
        <Modal
          onClose={() => setWitchModalIsOpened('')}
          children={<Sign editing={true} cancelEditingForm={() => setWitchModalIsOpened('')} />}
        />
      )}
      {witchModalIsOpened === 'Addresses' && (
        <Modal onClose={() => setWitchModalIsOpened('')} children={<Addresses />} />
      )}
      {witchModalIsOpened === 'Cards' && <Modal onClose={() => setWitchModalIsOpened('')} children={<SavedCards />} />}
    </div>
  )
}
