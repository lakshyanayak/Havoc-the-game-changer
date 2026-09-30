import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { missions as builtInMissions } from '../data/missions'
import { CUSTOM_REWARD_MAX, CUSTOM_DAILY_CAP } from '../data/rules'

// Maps a wellbeing percentage (0-100) to a mood label
export function getMoodFromWellbeing(score) {
  if (score >= 90) return 'Thriving'
  if (score >= 60) return 'Content'
  if (score >= 40) return 'Neutral'
  if (score >= 20) return 'Low'
  return 'Critical'
}

// "YYYY-MM-DD" in the player's LOCAL time zone
function getDateString(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Moves a "YYYY-MM-DD" string forward/backward by a number of days
function shiftDate(dateString, days) {
  const [y, m, d] = dateString.split('-').map(Number)
  return getDateString(new Date(y, m - 1, d + days))
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      // ---------- STATE ----------
      currencies: {
        coolant: 0,
        cells: 0,
        shards: 0,
      },

      marketCredits: 1000,
      marketInventory: [],

      // Progress per mission id. Timer missions store SECONDS, manual ones store counts.
      missionProgress: {
        water: { current: 0, completed: false },
        exercise: { current: 0, completed: false },
        sleep: { current: 0, completed: false },
      },

      streak: {
        current: 0,
        lastCompletedDate: null,
      },

      // The game's current day ("YYYY-MM-DD"). Kept in sync by syncDate().
      simulatedDate: getDateString(new Date()),

      // Testing only: extra days added on top of the real date
      dayOffset: 0,

      // One record per finished day, keyed by date:
      // { scores: {water, exercise, sleep}, wellbeing, allDone, customEarned }
      history: {},

      customTargets: {},
      customMissions: [],
      customEarnedToday: 0,

      // Companion cosmetics, bought and equipped from the Trading Center
      unlockedCompanionThemes: [],
      equippedCompanionTheme: null,

      // ---------- MISSION LISTS ----------
      getAllMissions: () => {
        return [...builtInMissions, ...get().customMissions]
      },

      // ---------- DAY ROLLOVER ----------
      // Compares the game's day with the real day. If they differ, archive the old
      // day into history, reset progress, and fix the streak.
      syncDate: () => {
        const state = get()
        const today = shiftDate(getDateString(new Date()), state.dayOffset || 0)
        const gameDay = state.simulatedDate

        if (today === gameDay) return

        // Only archive if the day we're leaving is really in the past
        let history = state.history || {}
        if (gameDay < today) {
          const scores = {}
          builtInMissions.forEach((m) => {
            scores[m.id] = state.getMissionScore(m.id)
          })

          history = {
            ...history,
            [gameDay]: {
              scores,
              wellbeing: state.getWellbeing(),
              allDone: builtInMissions.every((m) => state.missionProgress[m.id]?.completed),
              customEarned: state.customEarnedToday || 0,
            },
          }
        }

        const resetProgress = {}
        Object.keys(state.missionProgress).forEach((id) => {
          resetProgress[id] = { current: 0, completed: false }
        })

        // Streak survives only if the last completed day was yesterday
        const keepStreak = state.streak.lastCompletedDate === shiftDate(today, -1)

        set({
          simulatedDate: today,
          history,
          missionProgress: resetProgress,
          customEarnedToday: 0,
          streak: keepStreak ? state.streak : { ...state.streak, current: 0 },
        })
      },

      // ---------- CURRENCY ----------
      addCurrency: (currencyName, amount) =>
        set((state) => ({
          currencies: {
            ...state.currencies,
            [currencyName]: (state.currencies[currencyName] || 0) + amount,
          },
        })),

      purchaseMarketItem: (item) => {
        let purchased = false

        set((state) => {
          if (state.marketCredits < item.price) return state

          purchased = true
          return {
            marketCredits: state.marketCredits - item.price,
            marketInventory: [...(state.marketInventory || []), item],
          }
        })

        return purchased
      },

      // Pays a mission's reward. Custom missions are capped; built-in ones are not.
      // Returns the amount actually paid (can be 0 if the daily cap is used up).
      payReward: (missionId, reward) => {
        const state = get()
        const isCustom = missionId.startsWith('custom_')
        let amount = reward.amount

        if (isCustom) {
          const earned = state.customEarnedToday || 0
          const roomLeft = Math.max(0, CUSTOM_DAILY_CAP - earned)
          amount = Math.min(amount, CUSTOM_REWARD_MAX, roomLeft)
          set({ customEarnedToday: earned + amount })
        }

        if (amount > 0) state.addCurrency(reward.currency, amount)
        return amount
      },

      // ---------- COMPANION THEMES ----------
      // Called by the Trading Center when a theme is purchased.
      unlockCompanionTheme: (theme) =>
        set((state) => ({
          unlockedCompanionThemes: state.unlockedCompanionThemes.includes(theme)
            ? state.unlockedCompanionThemes
            : [...state.unlockedCompanionThemes, theme],
        })),

      // Called when the player equips an owned theme. Pass null to go back to plain.
      setCompanionTheme: (theme) => set({ equippedCompanionTheme: theme }),

      // ---------- CUSTOM TARGETS / MISSIONS ----------
      setCustomTarget: (missionId, value) =>
        set((state) => ({
          customTargets: { ...state.customTargets, [missionId]: value },
        })),

      addCustomMission: (missionData) => {
        const id = 'custom_' + Date.now()

        const newMission = {
          id,
          name: missionData.name,
          icon: missionData.icon || '🎯',
          description: missionData.description || '',
          target: missionData.target,
          unit: missionData.unit,
          singularUnit: missionData.unit,
          verificationType: missionData.verificationType,
          reward: {
            currency: missionData.currency,
            amount: Math.min(missionData.amount, CUSTOM_REWARD_MAX),
          },
        }

        set((state) => ({
          customMissions: [...state.customMissions, newMission],
          missionProgress: {
            ...state.missionProgress,
            [id]: { current: 0, completed: false },
          },
          currencies: {
            ...state.currencies,
            [missionData.currency]: state.currencies[missionData.currency] ?? 0,
          },
        }))
      },

      removeCustomMission: (missionId) =>
        set((state) => {
          const updatedProgress = { ...state.missionProgress }
          delete updatedProgress[missionId]
          const updatedTargets = { ...state.customTargets }
          delete updatedTargets[missionId]

          return {
            customMissions: state.customMissions.filter((m) => m.id !== missionId),
            missionProgress: updatedProgress,
            customTargets: updatedTargets,
          }
        }),

      // ---------- STREAK ----------
      // Counts only the 3 built-in habits. Custom missions never block a streak.
      checkStreak: () => {
        const state = get()
        const allBuiltInsDone = builtInMissions.every(
          (m) => state.missionProgress[m.id]?.completed
        )

        if (!allBuiltInsDone) return

        const today = state.simulatedDate
        if (state.streak.lastCompletedDate === today) return

        const isConsecutive = state.streak.lastCompletedDate === shiftDate(today, -1)

        set((state) => ({
          streak: {
            current: isConsecutive ? state.streak.current + 1 : 1,
            lastCompletedDate: today,
          },
        }))
      },

      // ---------- MISSION PROGRESS ----------
      // Manual missions (+1 per click).
      // Returns the amount paid if this click completed the mission, otherwise undefined.
      incrementMission: (missionId, target, reward) => {
        const state = get()
        const mission = state.missionProgress[missionId] || { current: 0, completed: false }
        if (mission.completed) return undefined

        const newCurrent = Math.min(mission.current + 1, target)
        const justCompleted = newCurrent >= target

        set((state) => ({
          missionProgress: {
            ...state.missionProgress,
            [missionId]: { current: newCurrent, completed: justCompleted },
          },
        }))

        if (justCompleted) {
          const paid = state.payReward(missionId, reward)
          state.checkStreak()
          return paid
        }
        return undefined
      },

      // Timer missions (absolute value in SECONDS).
      // Returns the amount paid if this update completed the mission, otherwise undefined.
      setTimerProgress: (missionId, currentValue, target, reward) => {
        const state = get()
        const mission = state.missionProgress[missionId] || { current: 0, completed: false }
        if (mission.completed) return undefined

        const clamped = Math.min(currentValue, target)
        const justCompleted = clamped >= target

        set((state) => ({
          missionProgress: {
            ...state.missionProgress,
            [missionId]: { current: clamped, completed: justCompleted },
          },
        }))

        if (justCompleted) {
          const paid = state.payReward(missionId, reward)
          state.checkStreak()
          return paid
        }
        return undefined
      },

      // ---------- SCORES & MOOD ----------
      // Score (0-100) for ONE mission: progress ÷ target
      getMissionScore: (missionId) => {
        const state = get()
        const def = state.getAllMissions().find((m) => m.id === missionId)
        if (!def) return 0

        const progress = state.missionProgress[missionId] || { current: 0 }
        const target = state.customTargets[missionId] || def.target
        const targetInProgressUnits = def.verificationType === 'timer' ? target * 60 : target

        if (targetInProgressUnits <= 0) return 0
        const percent = (progress.current / targetInProgressUnits) * 100
        return Math.min(100, Math.round(percent))
      },

      // Today's Wellbeing = average of the 3 BUILT-IN missions only.
      getWellbeing: () => {
        const state = get()
        const scores = builtInMissions.map((m) => state.getMissionScore(m.id))
        if (scores.length === 0) return 0

        const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length
        return Math.round(avg)
      },

      // Average wellbeing over the last N days (today's live value + past records).
      // Days with no record count as 0. Not used by any screen yet; the shelter tier
      // will use it so it doesn't drop to "Critical" every morning.
      getRollingWellbeing: (days = 3) => {
        const state = get()
        let total = state.getWellbeing()

        for (let i = 1; i < days; i++) {
          const day = shiftDate(state.simulatedDate, -i)
          total += state.history?.[day]?.wellbeing || 0
        }

        return Math.round(total / days)
      },

      // ---------- TESTING HELPERS ----------
      // Pretends one more day has passed, then runs the REAL rollover logic.
      simulateNextDay: () => {
        set((state) => ({ dayOffset: (state.dayOffset || 0) + 1 }))
        get().syncDate()
      },

      resetGame: () =>
        set({
          currencies: { coolant: 0, cells: 0, shards: 0 },
          marketCredits: 1000,
          marketInventory: [],
          missionProgress: {
            water: { current: 0, completed: false },
            exercise: { current: 0, completed: false },
            sleep: { current: 0, completed: false },
          },
          streak: { current: 0, lastCompletedDate: null },
          simulatedDate: getDateString(new Date()),
          dayOffset: 0,
          history: {},
          customTargets: {},
          customMissions: [],
          customEarnedToday: 0,
          unlockedCompanionThemes: [],
          equippedCompanionTheme: null,
        }),
    }),
    { name: 'havoc-game-storage' }
  )
)