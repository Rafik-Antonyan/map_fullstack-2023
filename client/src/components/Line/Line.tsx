import React from 'react'
import styles from './Line.module.scss'

export const Line: React.FC<{ width: number; showIndicator: boolean }> = ({ width, showIndicator }) => {
  return (
    <div className={styles.line}>
      <div
        className={styles.line_start}
        style={{
          width: width + '%',
        }}
      />
      {!!showIndicator && <div className={styles.line_circle} />}
      <div
        className={styles.line_end}
        style={{
          width: 100 - width + '%',
        }}
      />
    </div>
  )
}
