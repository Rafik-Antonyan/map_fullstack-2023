import React, { RefObject, useRef, useState } from 'react'
import styles from './FakeSelect.module.scss'
import { FakeSelectType } from '../../types/FakeSelectType'
import Modal from '../Modal/Modal'
import { ScheduleModal } from '../ScheduleModal/ScheduleModal'
import { useOutSideClick } from '../../hooks/useOutsideClick'

interface IFakeSelect {
  data: FakeSelectType[]
  width: string
  height?: string
  value: FakeSelectType
  setValue: CallableFunction
}

export const FakeSelect: React.FC<IFakeSelect> = ({ data, width, height, setValue, value }) => {
  const [isOpenOptions, setIsOpenOptions] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const ref: RefObject<HTMLDivElement> = useRef(null)

  useOutSideClick(ref, () => setIsOpenOptions(false))

  return (
    <div ref={ref} style={{ width }} className={styles.fakeSelect}>
      <div
        className={styles.fakeSelect_options}
        style={{ padding: 0 }}
        onClick={() => setIsOpenOptions(!isOpenOptions)}
      >
        {value.leftIcon && value.leftIcon}
        {value.text && (
          <div>
            <span>{value.text}</span>
          </div>
        )}
        {value.rightIcon && value.rightIcon}
      </div>
      {isOpenOptions && (
        <div style={{ width, height }} className={styles.fakeSelect_options_list}>
          {data.map((item: FakeSelectType, index: number) => {
            return (
              <div
                className={styles.fakeSelect_options}
                key={index}
                onClick={() => {
                  setIsOpenOptions(false)
                  setValue(item)
                  setIsModalOpen(item.text === 'Schedule for later')
                }}
              >
                {item.leftIcon && item.leftIcon}
                {item.text && (
                  <div>
                    <span>{item.text}</span>
                  </div>
                )}
                <div></div>
              </div>
            )
          })}
        </div>
      )}
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} children={<ScheduleModal />} />}
    </div>
  )
}
