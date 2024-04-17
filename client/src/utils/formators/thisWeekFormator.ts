export const thisWeekFormator = (date: Date): string => {
  const daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const day: number = date.getDate()
  const dayOfWeek: string = daysOfWeek[date.getDay()]
  const month: string = months[date.getMonth()]

  return `${dayOfWeek}, ${month} ${day}`
}
