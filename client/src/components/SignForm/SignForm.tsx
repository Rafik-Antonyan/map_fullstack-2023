import React, { ReactNode, useEffect } from 'react'
import { FakeHeader } from '../Header/FakeHeader/FakeHeader'
import { Button } from '../Button/Button'
import styles from './SignForm.module.scss'
import { Input } from '../Input/Input'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../redux/store'
import { setStyles } from '../../redux/features/header/headerSlice'
import useEnter from '../../hooks/useEnter'

type SignNavigationType = {
  text: string
  link: string
}

type SignButtonType = {
  text: string | ReactNode
  onClick: CallableFunction
  backgroundColor: string
  border: string
  color: string
}

export type SignInputType = {
  name: string
  value: string
  type?: string
  error: boolean
  errorText: string
}

export interface ISignForm {
  header: string
  inputs: SignInputType[]
  buttons: SignButtonType[]
  navigation?: SignNavigationType
  setValue?: CallableFunction
  useEnterButtonIndex?: number
}

export const SignForm: React.FC<ISignForm> = ({
  header,
  inputs,
  navigation,
  buttons,
  setValue,
  useEnterButtonIndex,
}) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setStyles({ background: 'rgba(205, 205, 205, 0.5)' }))
  }, [])

  useEnter(() => {
    if (useEnterButtonIndex) buttons[useEnterButtonIndex].onClick(inputs)
  })

  return (
    <>
      <FakeHeader />
      <div className={styles.sign_container}>
        <div className={styles.sign_container_form}>
          <h1>{header}</h1>
          <div className={styles.sign_container_form_inputs}>
            {inputs?.map((input: SignInputType, index: number) => {
              const firstLetterToUppercase: string = input.name?.[0].toUpperCase() + input.name?.substring(1)

              return (
                <div key={index}>
                  <label htmlFor={input.name} children={firstLetterToUppercase + ':'} />
                  <Input
                    type={input.type}
                    id={input.name}
                    placeholder={firstLetterToUppercase}
                    value={input.value}
                    setValue={(e: string) => setValue?.({ value: e, index })}
                  />
                  {input.error && <p className={styles.sign_container_form_inputs_error}>{input.errorText}</p>}
                </div>
              )
            })}
            {navigation && <p onClick={() => navigate(navigation?.link)}>{navigation?.text}</p>}
          </div>
          <div className={styles.sign_container_form_buttons}>
            {buttons?.map((button: SignButtonType, index: number) => {
              return (
                <Button
                  key={index}
                  onClick={() => button.onClick(inputs)}
                  background={button.backgroundColor}
                  children={button.text}
                  border={button.border}
                  color={button.color}
                />
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
