import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

// Checks "is it a new day?" when the app opens, when the tab becomes visible again
// (Page Visibility API), and once a minute in case the app is left open overnight.
export function useDaySync() {
  const syncDate = useGameStore((state) => state.syncDate)

  useEffect(() => {
    syncDate()

    function handleVisible() {
      if (!document.hidden) syncDate()
    }

    document.addEventListener('visibilitychange', handleVisible)
    const intervalId = setInterval(syncDate, 60000)

    return () => {
      document.removeEventListener('visibilitychange', handleVisible)
      clearInterval(intervalId)
    }
  }, [syncDate])
}