import { Time } from '../../types/OrderDetailsType'

export const formatingTimeFromFront = (time: Time): { start: Date; end: Date } => {
  const start = new Date()
  const end = new Date()
  const [startDate, startType, , endDate, endType] = time.hour.split(' ')

  start.setDate(+time.day.split(' ').at(-1)!)
  start.setHours(+startDate.split(':')[0] + (startType === 'PM' ? 12 : 0), +startDate.split(':')[1])

  end.setDate(+time.day.split(' ').at(-1)!)
  end.setHours(
    +endDate.split(':')[0] + (endType === 'PM' && +endDate.split(':')[0] !== 12 ? 12 : 0),
    +endDate.split(':')[1]
  )

  return { start, end }
}
