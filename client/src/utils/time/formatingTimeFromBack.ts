import { Time } from '../../types/OrderDetailsType'
import { getCurrentWeek } from './getCurrentWeek'

export const formatingTimeFromBack = ({ start, end }: { start: Date; end: Date }): Time => {
  const startDay = start.getDate() - +!start.getHours()
  const week = getCurrentWeek()

  let day: string = week.find(day => +day.text?.split(' ').at(-1)! === startDay)?.text!
  if (!day) {
    day = new Date(new Date().setDate(startDay)).toString().split(' ').slice(0, 3).join(' ')
  }

  let hour = ''

  if (start.getHours() !== 0) {
    hour = `${start.getHours() - (start.getHours() > 12 ? 12 : 0)}:${
      start.getMinutes() ? start.getMinutes() : start.getMinutes() + '0'
    } ${start.getHours() > 12 ? 'PM' : 'AM'} - `
  } else {
    hour = `12:${start.getMinutes() ? start.getMinutes() : start.getMinutes() + '0'} PM - `
  }

  if (end.getHours() !== 0) {
    hour += `${end.getHours() - (end.getHours() > 12 ? 12 : 0)}:${
      end.getMinutes() ? end.getMinutes() : end.getMinutes() + '0'
    } ${end.getHours() > 12 ? 'PM' : 'AM'}`
  } else {
    hour += `12:${end.getMinutes() ? end.getMinutes() : end.getMinutes() + '0'} PM`
  }

  return { day, hour }
}
