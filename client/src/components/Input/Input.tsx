import React, { ReactNode, forwardRef } from 'react'
import styles from './Input.module.scss'

interface IInput {
  id?: string
  type?: string
  value: string
  setValue: CallableFunction
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  placeholder?: string
  width?: string
  padding?: {
    x?: string
    y?: string
  }
  color?: string
  background?: string
  ref?: any
}

export const Input: React.FC<IInput> = forwardRef(
  (
    {
      id,
      type,
      value,
      setValue,
      leftIcon,
      rightIcon,
      placeholder,
      width,
      padding,
      color = 'black',
      background = 'white',
    },
    ref: any
  ) => {
    return (
      <div
        className={styles.inputContainer}
        style={{
          width,
          padding: `${padding?.y} ${padding?.x}`,
          color,
          background,
        }}
      >
        {leftIcon && <div className={styles.inputContainer_icons}>{leftIcon}</div>}
        <input
          id={id}
          ref={ref}
          placeholder={placeholder}
          className={styles.inputContainer_input}
          type={type ? type : 'text'}
          value={value}
          onChange={e => setValue(e.target.value)}
          style={{ color, background }}
        />
        {rightIcon && <div className={styles.inputContainer_icons}>{rightIcon}</div>}
      </div>
    )
  }
)
