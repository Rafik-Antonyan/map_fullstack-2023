export const generateTimeIntervals = (end: Date, day?: string) => {
  const intervals = []
  let currentTime

  if (new Date().getDate() === +day?.split(' ').at(-1)! && new Date().getHours() > 8) {
    currentTime = new Date(new Date().getTime() + 45 * 60000)
  } else {
    currentTime = new Date(new Date().setHours(9, 0, 0, 0))
  }

  const lastHoures = []
  if (currentTime.getHours() < 23) {
    lastHoures.push('11:00 PM - 11:30 PM', '11:15 PM - 11:45 PM', '11:30 PM - 12:00 AM')
  }

  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }

  const startMinutes = [0, 15, 30, 45]
  while (currentTime <= end) {
    let currentMinute = currentTime.getMinutes()
    let currentHour = currentTime.getHours()

    if (startMinutes.includes(currentMinute % 60)) {
      const startTimeFormatted = currentTime.toLocaleTimeString(
        'en-US',

        // @ts-ignore
        options
      )

      currentMinute += 30
      currentTime.setMinutes(currentMinute) // Increment by 30 minutes
      const endTimeFormatted = currentTime.toLocaleTimeString(
        'en-US',

        // @ts-ignore
        options
      )
      if (currentMinute === 60) {
        currentMinute -= 60
      }
      intervals.push(`${startTimeFormatted} - ${endTimeFormatted}`)
      currentMinute -= 15
      currentTime.setMinutes(currentMinute)
      if (currentMinute === 60) {
        currentHour += 1
        currentTime.setHours(currentHour)
      }
    } else {
      if (currentMinute < 45) {
        for (let i = 1; i < startMinutes.length; i++) {
          if (currentMinute < startMinutes[i]) {
            currentTime.setMinutes(startMinutes[i])
            break
          }
        }
      } else {
        currentTime.setMinutes(0)
        currentTime.setHours(currentHour + 1)
      }
    }
  }

  return [...intervals, ...lastHoures]
}
