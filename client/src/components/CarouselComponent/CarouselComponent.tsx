import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import { Review, SelectedPlaceType } from '../../types/SelectedPlaceType'
import { Review as ReviewComponent } from '../../components/Review/Review'

interface ICarouselComponent {
  data: SelectedPlaceType
  activeDotIndex: number
  setNumOfSwipe: CallableFunction
  setActiveDotIndex: CallableFunction
  numOfSwipe: number
}

export const CarouselComponent: React.FC<ICarouselComponent> = React.memo(
  ({ data, activeDotIndex, setNumOfSwipe, setActiveDotIndex, numOfSwipe }) => {
    return (
      <Carousel
        autoPlay={true}
        autoFocus={true}
        dynamicHeight={true}
        infiniteLoop={true}
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        showArrows={false}
        selectedItem={activeDotIndex}
        onChange={index => {
          setNumOfSwipe((prev: number) => prev + 1)
          setActiveDotIndex((prev: number) => (numOfSwipe ? index : prev))
        }}
      >
        {data?.reviews?.map((review: Review, index: number) => {
          return <ReviewComponent text={review.text} name={review.author_name} rating={review.rating} key={index} />
        })}
      </Carousel>
    )
  }
)
