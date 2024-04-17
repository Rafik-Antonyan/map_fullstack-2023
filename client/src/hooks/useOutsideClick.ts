import { RefObject, useEffect } from 'react'

type Event = MouseEvent | TouchEvent

export const useOutSideClick = <T extends HTMLElement>(ref: RefObject<T>, handle: (event: Event) => void) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current
      if (!el || el.contains((event?.target as Node) || null)) {
        return
      }
      handle(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handle])
}
