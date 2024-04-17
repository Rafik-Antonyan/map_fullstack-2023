import React, { MouseEventHandler, ReactNode } from 'react'
import styles from './Button.module.scss'

interface IButton {
  width?: string
  height?: string
  background?: string
  children: string | ReactNode
  color?: string
  borderRadius?: string
  padding?: string
  onClick: MouseEventHandler<HTMLButtonElement>
  border?: string
  disabled?: boolean,
}

export const Button: React.FC<IButton> = ({
  width = '100%',
  height = '100%',
  background,
  color = 'black',
  borderRadius = 0,
  padding = 0,
  children,
  onClick,
  border,
  disabled,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={styles.button}
      style={{
        width,
        height,
        background,
        color,
        borderRadius,
        padding,
        border,
      }}
    >
      {children}
    </button>
  )
}
