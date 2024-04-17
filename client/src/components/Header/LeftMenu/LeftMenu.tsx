import React, { Dispatch, RefObject, useRef } from 'react'
import ReactDOM from 'react-dom'
import styles from './LeftMenu.module.scss'
import { useOutSideClick } from '../../../hooks/useOutsideClick'
import { Button } from '../../Button/Button'
import { logo } from '../../../assets'
import { BsApple } from 'react-icons/bs'
import { AiFillAndroid } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { LoggedHeader } from '../LoggedHeader/LoggedHeader'

interface ILeftMenu {
  close: CallableFunction
  isOpen: boolean
  setImmidetlyClose: Dispatch<boolean>
  immidetlyClose: boolean
  isLogged: boolean
}

export const LeftMenu: React.FC<ILeftMenu> = ({ close, isOpen, immidetlyClose, setImmidetlyClose, isLogged }) => {
  const ref: RefObject<HTMLDivElement> = useRef(null)
  useOutSideClick(ref, () => close())
  const navigate = useNavigate()

  return ReactDOM.createPortal(
    <div
      className={styles.leftMenu}
      style={
        !immidetlyClose
          ? !isOpen
            ? { zIndex: -1, display: 'block' }
            : { zIndex: 5, display: 'block' }
          : { display: 'none' }
      }
    >
      <div className={styles.leftMenu_container} style={!isOpen ? { left: '-16vw' } : { left: 0 }} ref={ref}>
        <div className={styles.leftMenu_container_top}>
          {isLogged ? (
            <LoggedHeader isOpen={isOpen} close={close} />
          ) : (
            <>
              <div className={styles.leftMenu_container_top_buttons}>
                <Button
                  children='Sign up'
                  background='black'
                  color='white'
                  onClick={() => {
                    navigate('/sign/register')
                    close()
                    setImmidetlyClose(true)
                  }}
                />
                <Button
                  children='Log in'
                  background='rgb(238, 238, 238)'
                  onClick={() => {
                    navigate('/sign/login')
                    close()
                    setImmidetlyClose(true)
                  }}
                />
              </div>
              <div className={styles.leftMenu_container_top_list}>
                <p>Create a business account</p>
                <p>Add your restaurant</p>
                <p>Sign up to deliver</p>
              </div>
            </>
          )}
        </div>

        <div className={styles.leftMenu_container_bottom}>
          <div className={styles.leftMenu_container_bottom_container}>
            <img src={logo} />
            <h4>There's more to love in the app</h4>
          </div>
          <div className={styles.leftMenu_container_bottom_buttons}>
            <Button onClick={() => {}} background='rgb(238, 238, 238)'>
              <BsApple />
              IPhone
            </Button>
            <Button onClick={() => {}} background='rgb(238, 238, 238)'>
              <AiFillAndroid style={{ fontSize: '18px' }} />
              Android
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') as Element
  )
}
