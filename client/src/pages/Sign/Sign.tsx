/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ISignForm, SignForm, SignInputType } from '../../components/SignForm/SignForm'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { editUser, loginUser, registerUser } from '../../redux/features/user/userApi'
import { UserType } from '../../types/UserType'
import styles from './Sign.module.scss'

interface ISign {
  editing?: boolean
  cancelEditingForm?: CallableFunction
}

export const Sign: React.FC<ISign> = ({ editing = false, cancelEditingForm }) => {
  const navigate = useNavigate()
  const { type } = useParams<{ type: string }>()
  const [correctData, setCorrectData] = useState<ISignForm>({} as ISignForm)
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.user)
  const [errors, setErrors] = useState<UserType>({} as UserType)

  const valueSetter = ({ value, index }: { value: string; index: number }): void => {
    setCorrectData(prevState => {
      return {
        ...prevState,
        inputs: prevState.inputs.map((input, ind) => {
          if (index === ind) input.value = value

          return input
        }),
      }
    })
  }

  const clearValue = (type: ISignForm, keep?: string[]): void => {
    setCorrectData({
      ...type,
      inputs: type.inputs.map(input => {
        if (!keep?.includes(input.name)) {
          input.value = ''
        }

        return input
      }),
    })
  }

  const validation = (
    data: UserType,
    { type }: { type: string },
    inputs?: SignInputType[]
  ): { errors: UserType; inputs?: SignInputType[] } => {
    const emailReg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    const wordReg = new RegExp(/^\p{L}{3,}$/u)
    const passwordReg = new RegExp(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
    const errors: UserType = {} as UserType
    const passwordKeys: string[] = ['password', 'new password', 'confirm password']

    if (passwordKeys.every(field => data[field as keyof UserType] === '') && type === 'edit') {
      passwordKeys.forEach(key => delete data[key as keyof UserType])
      inputs = inputs?.filter(input => !passwordKeys.includes(input.name))
    }

    for (let key in data) {
      if (!data[key as keyof UserType]) {
        errors[key as keyof UserType] = ''
      } else if (key === 'email' && !emailReg.test(data.email)) {
        errors.email = ''
      } else if (passwordKeys.includes(key) && !passwordReg.test(data[key as keyof UserType]!)) {
        errors[key as keyof UserType] = ''
      } else if (!passwordKeys.includes(key) && key !== 'email' && !wordReg.test(data[key as keyof UserType]!)) {
        errors[key as keyof UserType] = ''
      }
    }
    setErrors(errors)
    setCorrectData(prev => {
      return {
        ...prev,
        inputs: prev.inputs.map(input => {
          if (Object.keys(errors).includes(input.name)) {
            input.error = true
          } else {
            input.error = false
          }
          return input
        }),
      }
    })

    return { errors, inputs }
  }

  const registration = (inputs: SignInputType[]): void => {
    const data: UserType = {} as UserType
    inputs.forEach(input => {
      data[input.name as keyof UserType] = input.value
    })
    const { errors } = validation(data, { type: 'registration' })
    if (!Object.keys(errors).length) {
      dispatch(registerUser(data))
      clearValue(registrationForm)
      navigate('/')
    }
  }

  const login = (inputs: SignInputType[]): void => {
    const data: UserType = {} as UserType
    inputs.forEach(input => {
      data[input.name as keyof UserType] = input.value
    })
    const { errors } = validation(data, { type: 'registration' })
    if (!Object.keys(errors).length) {
      dispatch(loginUser(data))
      clearValue(loginForm)
      navigate('/')
    }
  }

  const edit = (inputs: SignInputType[]): void => {
    const data: UserType = {} as UserType
    inputs.forEach(input => {
      data[input.name as keyof UserType] = input.value
    })

    const { errors, inputs: formatedInputs } = validation(data, { type: 'edit' }, inputs)
    if (!Object.keys(errors).length) {
      dispatch(editUser({ data: formatedInputs! }))
        .unwrap()
        .then(() => {
          clearValue(editForm, ['name', 'surname'])
        })
    }
  }

  const registrationForm: ISignForm = {
    inputs: [
      {
        name: 'name',
        value: '',
        error: errors.hasOwnProperty('name'),
        errorText: 'Name must includes only letters(min 3)',
      },
      {
        name: 'surname',
        value: '',
        error: errors.hasOwnProperty('surname'),
        errorText: 'Surname must includes only letters(min 3)',
      },
      {
        name: 'email',
        value: '',
        error: errors.hasOwnProperty('email'),
        errorText: 'Not valid email',
      },
      {
        name: 'password',
        value: '',
        type: 'password',
        error: errors.hasOwnProperty('password'),
        errorText: 'Password must have uppercase letter, digit, and at least 8 characters',
      },
    ],
    buttons: [
      {
        text: 'back',
        onClick: () => navigate(-1),
        backgroundColor: 'transparent',
        border: '2px solid #b3b3b3',
        color: 'black',
      },
      {
        text: 'Registration',
        onClick: (inputsData: SignInputType[]) => registration(inputsData),
        backgroundColor: 'green',
        border: '2px solid transparent',
        color: 'white',
      },
    ],
    header: 'Sign up',
    navigation: {
      text: 'Already have an account?',
      link: '/sign/login',
    },
    useEnterButtonIndex: 1,
  }

  const loginForm: ISignForm = {
    inputs: [
      {
        name: 'email',
        value: '',
        error: errors.hasOwnProperty('email'),
        errorText: 'Not valid email',
      },
      {
        name: 'password',
        value: '',
        type: 'password',
        error: errors.hasOwnProperty('password'),
        errorText: 'Password must have uppercase letter, digit, and at least 8 characters',
      },
    ],
    buttons: [
      {
        text: 'back',
        onClick: () => navigate(-1),
        backgroundColor: 'transparent',
        border: '2px solid #b3b3b3',
        color: 'black',
      },
      {
        text: 'login',
        onClick: (data: SignInputType[]) => login(data),
        backgroundColor: 'green',
        border: '2px solid transparent',
        color: 'white',
      },
    ],
    header: 'Login',
    navigation: {
      text: "Doesn't have an account?",
      link: '/sign/register',
    },
    useEnterButtonIndex: 1,
  }

  // es masy mi ban en chi, piti datark el lini
  const editForm: ISignForm = {
    inputs: [
      {
        name: 'name',
        value: user.name,
        error: errors.hasOwnProperty('name'),
        errorText: 'Name must includes only letters(min 3)',
      },
      {
        name: 'surname',
        value: user.surname,
        error: errors.hasOwnProperty('surname'),
        errorText: 'Surname must includes only letters(min 3)',
      },
      {
        name: 'password',
        value: '',
        type: 'password',
        error: errors.hasOwnProperty('password'),
        errorText: 'Password must have uppercase letter, digit, and at least 8 characters',
      },
      {
        name: 'new password',
        value: '',
        type: 'password',
        error: errors.hasOwnProperty('new password'),
        errorText: 'Password must have uppercase letter, digit, and at least 8 characters',
      },
      {
        name: 'confirm password',
        value: '',
        type: 'password',
        error: errors.hasOwnProperty('confirm password'),
        errorText: 'Password must have uppercase letter, digit, and at least 8 characters',
      },
    ],
    buttons: [
      {
        text: 'back',
        onClick: cancelEditingForm!,
        backgroundColor: 'transparent',
        border: '2px solid #b3b3b3',
        color: 'black',
      },
      {
        text: 'Save',
        onClick: (data: SignInputType[]) => edit(data),
        backgroundColor: 'green',
        border: '2px solid transparent',
        color: 'white',
      },
    ],
    header: 'Settings',
    useEnterButtonIndex: 1,
  }

  useEffect(() => {
    if (editing) {
      setCorrectData(editForm)
    } else if (type === 'register') {
      setCorrectData(registrationForm)
    } else if (type === 'login') {
      setCorrectData(loginForm)
    }
  }, [type])

  return (
    <div className={styles.registration} style={editing ? { height: 'max-content' } : {}}>
      <SignForm
        inputs={correctData.inputs}
        buttons={correctData.buttons}
        header={correctData.header}
        navigation={correctData.navigation}
        setValue={valueSetter}
        useEnterButtonIndex={correctData.useEnterButtonIndex}
      />
    </div>
  )
}
