import { useEffect } from 'react'

export function useAutoRefresh(callback: () => void, interval: number) {
  useEffect(() => {
    const id = setInterval(callback, interval)
    return () => clearInterval(id)
  }, [callback, interval])
}