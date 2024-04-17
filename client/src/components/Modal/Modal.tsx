import React from 'react'
import ReactDOM from 'react-dom'
import styles from './Modal.module.scss'

interface ModalInter {
  onClose: CallableFunction
  children: any
  style?: any
}

const Modal: React.FC<ModalInter> = props => {
  const { onClose, children, style } = props

  return ReactDOM.createPortal(
    <div className={styles.modal}>
      <div className={styles.modal_container} style={style}>
        <div className={styles.modal_container_head}>
          <span className={styles.modal_container_head_close} onClick={() => onClose()}>
            &times;
          </span>
        </div>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') as Element
  )
}

export default Modal
