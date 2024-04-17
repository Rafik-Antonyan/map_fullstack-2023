import React from 'react'
import styles from './ScheduleModal.module.scss'
import { ScheduleDataPicker } from '../ScheduleDataPicker/ScheduleDataPicker'

export const ScheduleModal: React.FC = () => {
  return (
    <div className={styles.scheduleModal}>
      <h1>Pick a time</h1>
      <ScheduleDataPicker />
    </div>
  )
}
