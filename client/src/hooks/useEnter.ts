import { useEffect } from 'react'

function useEnter(handler: any) {
  useEffect(() => {
    const listener = (event: any) => {
      if (event.charCode === 13) {
        event.preventDefault()
        handler()
      }
    }
    document.addEventListener('keypress', listener)

    return () => {
      document.removeEventListener('keypress', listener)
    }
  }, [handler])
}
export default useEnter
