import { useState, useRef, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

function ExerciseTimer({ mission, progress, effectiveTarget, onSetTarget, onComplete }) {
  const setTimerProgress = useGameStore((state) => state.setTimerProgress)

  const [isRunning, setIsRunning] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(progress.current)
  const [isTabHidden, setIsTabHidden] = useState(false)
  const [durationInput, setDurationInput] = useState(effectiveTarget)

  const startTimestampRef = useRef(null)
  const accumulatedRef = useRef(progress.current)
  const intervalRef = useRef(null)

  const targetSeconds = effectiveTarget * 60
  const canEditDuration = !isRunning && elapsedSeconds === 0 && !progress.completed
  const startLabel = mission.id === 'exercise' ? 'Start Exercise' : 'Start'

  // Page Visibility API: just tells us when the tab is hidden/visible
  useEffect(() => {
    function handleVisibilityChange() {
      setIsTabHidden(document.hidden)
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // If the store resets this mission's progress to 0 (new day / reset game),
  // stop the timer and clear our local copy of the time.
  useEffect(() => {
    if (progress.current === 0 && elapsedSeconds > 0) {
      setIsRunning(false)
      setElapsedSeconds(0)
      accumulatedRef.current = 0
    }
  }, [progress.current])

  // When the goal changes from outside (e.g. reset), update the duration box too.
  useEffect(() => {
    setDurationInput(effectiveTarget)
  }, [effectiveTarget])

  // The ticking logic (timestamp-based, so tab switching can't make it drift)
  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const secondsSinceStart = Math.floor((now - startTimestampRef.current) / 1000)
      const total = Math.min(accumulatedRef.current + secondsSinceStart, targetSeconds)

      setElapsedSeconds(total)

      // Returns the amount paid only on the tick that completes the mission
      const paid = setTimerProgress(mission.id, total, targetSeconds, mission.reward)

      if (total >= targetSeconds) {
        setIsRunning(false)
        clearInterval(intervalRef.current)
        if (onComplete && paid !== undefined) onComplete(paid)
      }
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  function handleDurationChange(e) {
    setDurationInput(Number(e.target.value))
  }

  function handleDurationSave() {
    if (durationInput > 0) {
      onSetTarget(durationInput)
    }
  }

  function handleStart() {
    startTimestampRef.current = Date.now()
    setIsRunning(true)
  }

  function handlePause() {
    accumulatedRef.current = elapsedSeconds
    setIsRunning(false)
  }

  function handleStop() {
    setIsRunning(false)
    accumulatedRef.current = 0
    setElapsedSeconds(0)
    setTimerProgress(mission.id, 0, targetSeconds, mission.reward)
  }

  if (progress.completed) {
    return <p className="text-green-400 font-bold">✓ Completed</p>
  }

  const displayMinutes = Math.floor(elapsedSeconds / 60)
  const displaySeconds = elapsedSeconds % 60

  return (
    <div>
      {canEditDuration && (
        <div className="flex items-center gap-2 mb-2">
          <label className="text-xs text-gray-400">Duration (min):</label>
          <input
            type="number"
            min="1"
            value={durationInput}
            onChange={handleDurationChange}
            onBlur={handleDurationSave}
            className="w-16 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
          />
        </div>
      )}

      <p className="text-2xl font-mono mb-2">
        {String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
      </p>

      {isTabHidden && isRunning && (
        <p className="text-yellow-400 text-xs mb-2">
          Tab hidden — timer still tracking real time
        </p>
      )}

      <div className="flex gap-2">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-bold"
          >
            {elapsedSeconds > 0 ? 'Resume' : startLabel}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-lg font-bold"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleStop}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-bold"
        >
          Stop
        </button>
      </div>
    </div>
  )
}

export default ExerciseTimer