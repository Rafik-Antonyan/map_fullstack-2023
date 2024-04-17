import React, { useEffect, useState } from 'react'
import { FakeSelect } from '../FakeSelect/FakeSelect'
import { FakeSelectType } from '../../types/FakeSelectType'
import { generateTimeIntervals } from '../../utils/time/generateTimeIntervals'
import { useOrderContext } from '../../context/OrderContext'
import { getCurrentWeek } from '../../utils/time/getCurrentWeek'

export const ScheduleDataPicker: React.FC = () => {
  const endDate = new Date()
  endDate.setHours(24, 0, 0, 0)

  const { order, setOrder } = useOrderContext()

  const [selected, setSelected] = useState<{
    day: FakeSelectType
    time: FakeSelectType
  }>({
    day: getCurrentWeek()[0],
    time: generateTimeIntervals(endDate, new Date().getDate() + '').map(elm => ({
      text: elm,
    }))[0],
  })

  useEffect(() => {
    if (+selected.day.text?.split(' ').at(-1)! === new Date().getDate())
      setSelected({
        ...selected,
        time: generateTimeIntervals(endDate, new Date().getDate() + '').map(elm => ({
          text: elm,
        }))[0],
      })
  }, [selected.day.text])

  const setValues = (element: FakeSelectType, type: 'day' | 'time') => {
    const copy: {
      day: FakeSelectType
      time: FakeSelectType
    } = { ...selected }

    copy[type].text = element.text

    setSelected(copy)

    if (copy.day.text && copy.time.text) {
      setOrder({
        ...order,
        time: {
          day: copy.day.text,
          hour: copy.time.text,
        },
      })
    }
  }

  useEffect(() => {
    setOrder({
      ...order,
      time: {
        day: selected.day.text,
        hour: selected.time.text,
      },
    })
  }, [])

  return (
    <div>
      <FakeSelect
        width='500px'
        data={getCurrentWeek()}
        value={selected.day}
        setValue={(e: FakeSelectType) => setValues(e, 'day')}
      />
      <FakeSelect
        value={selected.time}
        setValue={(e: FakeSelectType) => setValues(e, 'time')}
        width='500px'
        height='25vh'
        data={generateTimeIntervals(endDate, selected.day.text).map(elm => ({
          text: elm,
        }))}
      />
    </div>
  )
}
