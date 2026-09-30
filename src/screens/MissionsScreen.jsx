import { useState, useRef } from 'react'
import { useGameStore, getMoodFromWellbeing } from '../store/gameStore'
import ExerciseTimer from '../components/ExerciseTimer'
import AddMissionForm from '../components/AddMissionForm'
import { getRandomQuirkyWarning } from '../data/quirkyWarnings'
import { currencyInfo } from '../data/currencies'
import { CUSTOM_DAILY_CAP } from '../data/rules'
import { useDaySync } from '../utils/useDaySync'
import { singularize } from '../utils/singularize'

function ManualTargetInput({ mission, effectiveTarget, onSetTarget }) {
  const [value, setValue] = useState(effectiveTarget)
  return (
    <div className="flex items-center gap-2 mb-3">
      <label className="text-xs text-gray-400 uppercase tracking-wide">
        Goal ({mission.unit}):
      </label>
      <input
        type="number"
        min="1"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        onBlur={() => value > 0 && onSetTarget(value)}
        className="w-16 bg-black/50 border border-gray-600 focus:border-cyan-400 outline-none rounded-md px-2 py-1 text-sm transition-colors"
      />
    </div>
  )
}

function MissionsScreen({ onPlayWelcome }) {
  const missionProgress = useGameStore((state) => state.missionProgress)
  const logout = useGameStore((state) => state.logout)
  const companionName = useGameStore((state) => state.companionName || 'Companion')
  const setCompanionName = useGameStore((state) => state.setCompanionName)
  const incrementMission = useGameStore((state) => state.incrementMission)
  const currencies = useGameStore((state) => state.currencies)
  const getWellbeing = useGameStore((state) => state.getWellbeing)
  const getMissionScore = useGameStore((state) => state.getMissionScore)
  const resetGame = useGameStore((state) => state.resetGame)
  const streak = useGameStore((state) => state.streak)
  const simulateNextDay = useGameStore((state) => state.simulateNextDay)
  const customTargets = useGameStore((state) => state.customTargets)
  const setCustomTarget = useGameStore((state) => state.setCustomTarget)
  const getAllMissions = useGameStore((state) => state.getAllMissions)
  const addCustomMission = useGameStore((state) => state.addCustomMission)
  const removeCustomMission = useGameStore((state) => state.removeCustomMission)
  const customEarnedToday = useGameStore((state) => state.customEarnedToday) || 0
  const history = useGameStore((state) => state.history) || {}

  // Automatically resets missions when a new real day starts
  useDaySync()

  const [showAddForm, setShowAddForm] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [toast, setToast] = useState(null)
  const [toastType, setToastType] = useState('reward') // 'reward' or 'warning'
  const lastClickTimeRef = useRef({})

  const wellbeing = getWellbeing()
  const mood = getMoodFromWellbeing(wellbeing)
  const allMissions = getAllMissions()
  const currencyNames = Object.keys(currencies)
  const daysLogged = Object.keys(history).length

  function handleAddMission(missionData) {
    addCustomMission(missionData)
    setShowAddForm(false)
  }

  function showRewardToast(amount, currency) {
    const label = currencyInfo[currency]?.label || currency
    setToastType('reward')
    setToast(`+${amount} ${label}`)
    setTimeout(() => setToast(null), 2000)
  }

  function showWarningToast() {
    setToastType('warning')
    setToast(getRandomQuirkyWarning())
    setTimeout(() => setToast(null), 3000)
  }

  function showCapToast() {
    setToastType('warning')
    setToast('Custom reward cap reached for today')
    setTimeout(() => setToast(null), 3000)
  }

  // Returns true if this mission's button is being clicked suspiciously fast
  function isClickingTooFast(missionId) {
    const now = Date.now()
    const lastTime = lastClickTimeRef.current[missionId] || 0
    const gap = now - lastTime

    lastClickTimeRef.current[missionId] = now

    return gap < 400
  }

  const moodColor =
    wellbeing >= 90 ? 'from-cyan-400 to-emerald-400' :
    wellbeing >= 60 ? 'from-cyan-400 to-purple-500' :
    wellbeing >= 40 ? 'from-purple-500 to-purple-700' :
    wellbeing >= 20 ? 'from-orange-500 to-purple-700' :
    'from-red-600 to-purple-800'

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a14] via-[#0d0d1a] to-black text-white p-5 pb-16">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 toast-glitch max-w-[90%]">
          <div
            className={`relative bg-black border px-5 py-2 font-mono text-sm tracking-wider ${
              toastType === 'warning'
                ? 'border-red-500 text-red-300 shadow-[0_0_25px_rgba(239,68,68,0.5)]'
                : 'border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.5)]'
            }`}
            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
          >
            <span className={toastType === 'warning' ? 'text-red-400' : 'text-emerald-400'}>
              {toastType === 'warning' ? '⚠' : '▸'}
            </span>{' '}
            {toast}
            <span
              className={`absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 ${
                toastType === 'warning' ? 'border-red-500' : 'border-cyan-400'
              }`}
            />
            <span
              className={`absolute -bottom-px -right-px w-2 h-2 border-b-2 border-r-2 ${
                toastType === 'warning' ? 'border-red-500' : 'border-cyan-400'
              }`}
            />
          </div>
        </div>
      )}

      <div className="relative mx-auto mb-3 flex max-w-md justify-end">
        <button
          type="button"
          aria-label="Settings"
          aria-expanded={showSettings}
          aria-controls="missions-settings-menu"
          onClick={() => setShowSettings((isOpen) => !isOpen)}
          className="flex h-9 w-9 items-center justify-center border border-white/15 bg-white/5 text-lg text-gray-300 transition-colors hover:border-cyan-400/50 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
        >
          ⚙
        </button>
        {showSettings && (
          <div
            id="missions-settings-menu"
            className="absolute right-0 top-10 z-30 min-w-48 border border-white/15 bg-[#11111d] p-2 shadow-lg"
          >
            <label className="block px-2 py-1">
              <span className="text-[10px] uppercase tracking-widest text-gray-400">Companion name</span>
              <input
                type="text"
                value={companionName}
                onChange={(event) => setCompanionName(event.target.value)}
                maxLength={18}
                aria-label="Companion name"
                className="mt-1 w-full border border-white/15 bg-black/50 px-2 py-1.5 text-sm text-white outline-none focus:border-cyan-300"
              />
            </label>
            <button
              type="button"
              onClick={logout}
              className="w-full px-3 py-2 text-left text-sm text-gray-200 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
            >
              Log out
            </button>
          </div>
        )}
      </div>

      {/* Wellbeing */}
      <div className="max-w-md mx-auto mb-5">
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-xs uppercase tracking-widest text-gray-400">Wellbeing</span>
          <span className="text-sm font-semibold text-cyan-300">{mood} · {wellbeing}%</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden ring-1 ring-white/10">
          <div
            className={`h-full bg-gradient-to-r ${moodColor} transition-all duration-700 ease-out`}
            style={{ width: `${wellbeing}%` }}
          />
        </div>
      </div>

      {/* Currency + streak + days logged bar */}
      <div className="flex justify-center gap-2 mb-6 text-sm flex-wrap">
        {currencyNames.map((name) => (
          <span
            key={name}
            className="bg-white/5 backdrop-blur border border-purple-500/40 rounded-full px-3.5 py-1 font-medium shadow-[0_0_10px_rgba(168,85,247,0.15)]"
          >
            {currencyInfo[name]?.icon || '🪙'} {currencies[name]}{' '}
            <span className="text-purple-300">{currencyInfo[name]?.label || name}</span>
          </span>
        ))}
        <span className="bg-white/5 backdrop-blur border border-orange-500/40 rounded-full px-3.5 py-1 font-medium shadow-[0_0_10px_rgba(249,115,22,0.15)]">
          🔥 {streak.current} day{streak.current === 1 ? '' : 's'}
        </span>
        <span className="bg-white/5 backdrop-blur border border-cyan-400/40 rounded-full px-3.5 py-1 font-medium shadow-[0_0_10px_rgba(34,211,238,0.2)]">
          📅 {daysLogged} day{daysLogged === 1 ? '' : 's'} logged
        </span>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center tracking-tight bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
        Today's Missions
      </h1>

      {/* Mission cards */}
      <div className="flex flex-col gap-3.5 max-w-md mx-auto">
        {allMissions.map((mission) => {
          const progress = missionProgress[mission.id] || { current: 0, completed: false }
          const effectiveTarget = customTargets[mission.id] || mission.target
          const isTimer = mission.verificationType === 'timer'
          const canEditManualTarget = !isTimer && progress.current === 0 && !progress.completed
          const isCustom = mission.id.startsWith('custom_')

          const displayProgress = isTimer
            ? Math.floor(progress.current / 60)
            : progress.current

          const progressPercent = Math.min(100, (displayProgress / effectiveTarget) * 100)

          const score = getMissionScore(mission.id)
          const missionMood = getMoodFromWellbeing(score)
          const rewardLabel = currencyInfo[mission.reward.currency]?.label || mission.reward.currency

          // Card description: built-in Exercise keeps its wording, custom timers get a neutral one
          let descriptionText = mission.description
          if (isTimer && !isCustom) {
            descriptionText = `Exercise or meditate for ${effectiveTarget} ${mission.unit}`
          } else if (isTimer && isCustom) {
            descriptionText = `${mission.name} for ${effectiveTarget} ${mission.unit}`
          }

          // Button label: custom units are singularized ("pages" -> "page")
          const buttonUnit = isCustom ? singularize(mission.unit) : mission.singularUnit

          return (
            <div
              key={mission.id}
              className={`relative bg-white/[0.03] backdrop-blur border rounded-2xl p-4 transition-all duration-500 ${
                progress.completed
                  ? 'border-emerald-400/60 shadow-[0_0_20px_rgba(52,211,153,0.15)]'
                  : 'border-white/10 hover:border-purple-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl leading-none">{mission.icon}</span>
                  <h2 className="font-semibold tracking-tight">{mission.name}</h2>
                </div>
                {isCustom && (
                  <button
                    onClick={() => removeCustomMission(mission.id)}
                    className="text-gray-600 hover:text-red-400 text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-500/10 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              <p className="text-gray-500 text-xs mb-3 leading-relaxed">
                {descriptionText}
              </p>

              {canEditManualTarget && (
                <ManualTargetInput
                  mission={mission}
                  effectiveTarget={effectiveTarget}
                  onSetTarget={(value) => setCustomTarget(mission.id, value)}
                />
              )}

              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{displayProgress} / {effectiveTarget} {mission.unit}</span>
                {!isCustom && <span className="text-gray-500">{missionMood} · {score}%</span>}
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    progress.completed ? 'bg-emerald-400' : 'bg-gradient-to-r from-purple-500 to-cyan-400'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-300/80 font-medium">
                  +{mission.reward.amount} {rewardLabel}
                </span>

                {mission.verificationType === 'manual' && (
                  <>
                    {progress.completed ? (
                      <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                        ✓ Done
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          const tooFast = isClickingTooFast(mission.id)
                          const paid = incrementMission(mission.id, effectiveTarget, mission.reward)

                          if (tooFast) {
                            showWarningToast()
                          } else if (paid === 0) {
                            showCapToast()
                          } else if (paid !== undefined) {
                            showRewardToast(paid, mission.reward.currency)
                          }
                        }}
                        className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 px-4 py-1.5 rounded-lg font-semibold text-sm shadow-[0_0_12px_rgba(147,51,234,0.35)] transition-all active:scale-95"
                      >
                        +1 {buttonUnit}
                      </button>
                    )}
                  </>
                )}
              </div>

              {mission.verificationType === 'timer' && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <ExerciseTimer
                    mission={mission}
                    progress={progress}
                    effectiveTarget={effectiveTarget}
                    onSetTarget={(minutes) => setCustomTarget(mission.id, minutes)}
                    onComplete={(paid) => {
                      if (paid === 0) showCapToast()
                      else showRewardToast(paid, mission.reward.currency)
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add mission */}
      <div className="max-w-md mx-auto mt-5">
        {showAddForm ? (
          <AddMissionForm
            existingCurrencies={currencyNames}
            onAdd={handleAddMission}
            onCancel={() => setShowAddForm(false)}
          />
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full border border-dashed border-purple-500/40 text-purple-300/80 rounded-2xl py-3 text-sm font-medium hover:border-purple-400 hover:text-purple-200 hover:bg-white/[0.02] transition-all"
          >
            + Add Custom Mission
          </button>
        )}
        <p className="text-center text-xs text-gray-600 mt-2">
          Custom rewards today: {customEarnedToday} / {CUSTOM_DAILY_CAP}
        </p>
      </div>

      {/* Testing controls */}
      <div className="text-center mt-10 flex justify-center gap-5">
        <button
          onClick={simulateNextDay}
          className="text-gray-600 text-xs hover:text-gray-400 transition-colors"
        >
          ⏭ Simulate Next Day
        </button>
        <button
          onClick={resetGame}
          className="text-gray-600 text-xs hover:text-gray-400 transition-colors"
        >
          ↺ Reset Game
        </button>
      </div>

      <section className="max-w-md mx-auto mt-8 border-t border-white/10 pt-4">
        <h2 className="text-xs uppercase tracking-widest text-gray-400">Events</h2>
        <button
          type="button"
          onClick={onPlayWelcome}
          className="mt-2 flex w-full items-center justify-between border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm transition-colors hover:border-cyan-400/40"
        >
          <span>HAVOC-welcome</span>
          <span
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-[#111a3a] text-violet-300"
            aria-hidden="true"
          >
            ▶
          </span>
        </button>
      </section>
    </div>
  )
}

export default MissionsScreen