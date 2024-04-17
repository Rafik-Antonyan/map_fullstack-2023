import { FakeSelectType } from '../../types/FakeSelectType'
import { thisWeekFormator } from '../formators/thisWeekFormator'
import { IoIosArrowDown } from 'react-icons/io'

export const getCurrentWeek = (): FakeSelectType[] => {
  const currentDate: Date = new Date()
  const dateData: FakeSelectType[] = []
  for (let i = 0; i < 7; i++) {
    const formattedDate: string = thisWeekFormator(currentDate)
    let dayText = ''
    if (i === 0) {
      dayText = 'Today'
    } else if (i === 1) {
      dayText = 'Tomorrow'
    }
    const finalText: string = dayText ? `${dayText}, ${formattedDate}` : formattedDate
    dateData.push({ text: finalText })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dateData.map(data => {
    data['rightIcon'] = <IoIosArrowDown />

    return data
  })
}
