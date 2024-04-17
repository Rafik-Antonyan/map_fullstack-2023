import React from 'react'
import styles from './Review.module.scss'
import { Rating } from 'react-simple-star-rating'

interface IReview {
  text: string
  rating: number
  name: string
}

export const Review: React.FC<IReview> = ({ text, rating, name }) => {
  return (
    <div className={styles.review_container}>
      <div className={styles.review_container_header}>
        <h1>{name}</h1>
      </div>
      <div className={styles.review_container_main}>
        <div className={styles.review_container_main_miniDiv1}></div>
        <div className={styles.review_container_main_miniDiv2}></div>
        <div className={styles.review_container_main_container}>
          <Rating initialValue={rating} readonly={true} allowFraction={true} />
          <p>{text}</p>
        </div>
      </div>
      <div className={styles.review_container_avatar}>{name.substring(0, 1).toUpperCase()}</div>
    </div>
  )
}
