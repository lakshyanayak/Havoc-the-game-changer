import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { missions as builtInMissions } from '../data/missions'
import {
  CUSTOM_REWARD_MAX,
  CUSTOM_DAILY_CAP,
} from '../data/rules'

// Maps wellbeing percentage (0-100) to a mood label
export function getMoodFromWellbeing(score) {
  if (score >= 90) return 'Thriving'
  if (score >= 60) return 'Content'
  if (score >= 40) return 'Neutral'
  if (score >= 20) return 'Low'
  return 'Critical'
}

// "YYYY-MM-DD" in player's LOCAL time zone
function getDateString(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')

  return `${y}-${m}-${d}`
}

// Move a date forward/backward
function shiftDate(dateString, days) {
  const [y, m, d] = dateString
    .split('-')
    .map(Number)

  return getDateString(
    new Date(y, m - 1, d + days)
  )
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      // ==================================================
      // STATE
      // ==================================================

      currencies: {
        coolant: 0,
        cells: 0,
        shards: 0,
      },
      playerName: null,
      companionName: 'Companion',
      loginCount: 0,
      ownedThemes: ['default'],
      equippedTheme: 'default',
      marketCredits: 1000,
      marketInventory: [],

      // --------------------------------------------------
      // Shelter
      // --------------------------------------------------

      shelterTheme: 'classic',

      // These five themes are FREE by default.
      ownedShelterThemes: [
        'classic',
        'neon',
        'wasteland',
        'bio',
        'holo',
      ],

      // Custom currencies that the player chooses
      // to show in the Trading Centre wallet.
      featuredCurrencies: [],

      // --------------------------------------------------
      // Mission progress
      // --------------------------------------------------

      missionProgress: {
        water: {
          current: 0,
          completed: false,
        },

        exercise: {
          current: 0,
          completed: false,
        },

        sleep: {
          current: 0,
          completed: false,
        },
      },

      streak: {
        current: 0,
        lastCompletedDate: null,
      },

      // Current game day
      simulatedDate: getDateString(
        new Date()
      ),

      // Testing only
      dayOffset: 0,

      // Previous day records
      history: {},

      customTargets: {},

      customMissions: [],

      customEarnedToday: 0,

      // ==================================================
      // MISSION LISTS
      // ==================================================

      getAllMissions: () => {
        return [
          ...builtInMissions,
          ...get().customMissions,
        ]
      },
      setPlayerName: (name) =>
        set((state) => ({ playerName: name, loginCount: (state.loginCount || 0) + 1 })),
      setCompanionName: (name) => set({ companionName: name }),
      logout: () => set({ playerName: null }),

      // ==================================================
      // DAY ROLLOVER
      // ==================================================

      syncDate: () => {
        const state = get()

        const today = shiftDate(
          getDateString(new Date()),
          state.dayOffset || 0
        )

        const gameDay = state.simulatedDate

        if (today === gameDay) {
          return
        }

        let history = state.history || {}

        if (gameDay < today) {
          const scores = {}

          builtInMissions.forEach((mission) => {
            scores[mission.id] =
              state.getMissionScore(
                mission.id
              )
          })

          history = {
            ...history,

            [gameDay]: {
              scores,

              wellbeing:
                state.getWellbeing(),

              allDone:
                builtInMissions.every(
                  (mission) =>
                    state.missionProgress[
                      mission.id
                    ]?.completed
                ),

              customEarned:
                state.customEarnedToday || 0,
            },
          }
        }

        const resetProgress = {}

        Object.keys(
          state.missionProgress
        ).forEach((id) => {
          resetProgress[id] = {
            current: 0,
            completed: false,
          }
        })

        const keepStreak =
          state.streak.lastCompletedDate ===
          shiftDate(today, -1)

        set({
          simulatedDate: today,

          history,

          missionProgress:
            resetProgress,

          customEarnedToday: 0,

          streak: keepStreak
            ? state.streak
            : {
                ...state.streak,
                current: 0,
              },
        })
      },

      // ==================================================
      // CURRENCY
      // ==================================================

      addCurrency: (
        currencyName,
        amount
      ) =>
        set((state) => ({
          currencies: {
            ...state.currencies,

            [currencyName]:
              (state.currencies[
                currencyName
              ] || 0) + amount,
          },
        })),

      // ==================================================
      // FEATURED CUSTOM CURRENCIES
      // ==================================================

      toggleFeaturedCurrency: (
        currencyName
      ) =>
        set((state) => {
          const current =
            state.featuredCurrencies || []

          // Remove if already selected
          if (
            current.includes(currencyName)
          ) {
            return {
              featuredCurrencies:
                current.filter(
                  (currency) =>
                    currency !== currencyName
                ),
            }
          }

          // Maximum 3 featured currencies
          if (current.length >= 3) {
            return state
          }

          return {
            featuredCurrencies: [
              ...current,
              currencyName,
            ],
          }
        }),

      // ==================================================
      // SHELTER THEMES
      // ==================================================

      setShelterTheme: (themeId) => {
        const state = get()

        const owned =
          state.ownedShelterThemes || []

        if (!owned.includes(themeId)) {
          return
        }

        set({
          shelterTheme: themeId,
        })
      },

      purchaseShelterTheme: (theme) => {
        let purchased = false

        set((state) => {
          const owned =
            state.ownedShelterThemes || []

          // Already owned
          if (owned.includes(theme.id)) {
            return state
          }

          const cost = theme.cost || {}

          // Check every currency
          const canAfford =
            Object.entries(cost).every(
              ([currency, amount]) => {
                const balance =
                  state.currencies?.[
                    currency
                  ] || 0

                return balance >= amount
              }
            )

          if (!canAfford) {
            return state
          }

          // Remove currencies
          const updatedCurrencies = {
            ...state.currencies,
          }

          Object.entries(cost).forEach(
            ([currency, amount]) => {
              updatedCurrencies[currency] =
                (updatedCurrencies[
                  currency
                ] || 0) - amount
            }
          )

          purchased = true

          return {
            currencies:
              updatedCurrencies,

            ownedShelterThemes: [
              ...owned,
              theme.id,
            ],

            // Automatically equip
            shelterTheme: theme.id,
          }
        })

        return purchased
      },

      buyTheme: (theme) => {
        let purchased = false

        set((state) => {
          const ownedThemes = state.ownedThemes || ['default']
          if (ownedThemes.includes(theme.id)) return state

          const cost = Object.entries(theme.cost || {})
          const canAfford = cost.every(
            ([currency, amount]) => (state.currencies[currency] || 0) >= amount
          )
          if (!canAfford) return state

          purchased = true
          return {
            ownedThemes: [...ownedThemes, theme.id],
            currencies: cost.reduce(
              (currencies, [currency, amount]) => ({
                ...currencies,
                [currency]: currencies[currency] - amount,
              }),
              { ...state.currencies }
            ),
          }
        })

        return purchased
      },
      equipTheme: (themeId) =>
        set((state) =>
          (state.ownedThemes || ['default']).includes(themeId)
            ? { equippedTheme: themeId }
            : state
        ),

      // Pays a mission's reward. Custom missions are capped; built-in ones are not.
      // Returns the amount actually paid (can be 0 if the daily cap is used up).
      payReward: (missionId, reward) => {
        const state = get()

        const isCustom =
          missionId.startsWith(
            'custom_'
          )

        let amount = reward.amount

        if (isCustom) {
          const earned =
            state.customEarnedToday || 0

          const roomLeft =
            Math.max(
              0,
              CUSTOM_DAILY_CAP -
                earned
            )

          amount = Math.min(
            amount,
            CUSTOM_REWARD_MAX,
            roomLeft
          )

          set({
            customEarnedToday:
              earned + amount,
          })
        }

        if (amount > 0) {
          state.addCurrency(
            reward.currency,
            amount
          )
        }

        return amount
      },

      // ==================================================
      // CUSTOM TARGETS
      // ==================================================

      setCustomTarget: (
        missionId,
        value
      ) =>
        set((state) => ({
          customTargets: {
            ...state.customTargets,

            [missionId]: value,
          },
        })),

      // ==================================================
      // CUSTOM MISSIONS
      // ==================================================

      addCustomMission: (
        missionData
      ) => {
        const id =
          'custom_' +
          Date.now()

        const newMission = {
          id,

          name:
            missionData.name,

          icon:
            missionData.icon ||
            '🎯',

          description:
            missionData.description ||
            '',

          target:
            missionData.target,

          unit:
            missionData.unit,

          singularUnit:
            missionData.unit,

          verificationType:
            missionData.verificationType,

          reward: {
            currency:
              missionData.currency,

            amount: Math.min(
              missionData.amount,
              CUSTOM_REWARD_MAX
            ),
          },
        }

        set((state) => ({
          customMissions: [
            ...state.customMissions,
            newMission,
          ],

          missionProgress: {
            ...state.missionProgress,

            [id]: {
              current: 0,
              completed: false,
            },
          },

          currencies: {
            ...state.currencies,

            [missionData.currency]:
              state.currencies[
                missionData.currency
              ] ?? 0,
          },
        }))
      },

      removeCustomMission: (
        missionId
      ) =>
        set((state) => {
          const updatedProgress = {
            ...state.missionProgress,
          }

          delete updatedProgress[
            missionId
          ]

          const updatedTargets = {
            ...state.customTargets,
          }

          delete updatedTargets[
            missionId
          ]

          return {
            customMissions:
              state.customMissions.filter(
                (mission) =>
                  mission.id !==
                  missionId
              ),

            missionProgress:
              updatedProgress,

            customTargets:
              updatedTargets,
          }
        }),

      // ==================================================
      // STREAK
      // ==================================================

      checkStreak: () => {
        const state = get()

        const allBuiltInsDone =
          builtInMissions.every(
            (mission) =>
              state.missionProgress[
                mission.id
              ]?.completed
          )

        if (!allBuiltInsDone) {
          return
        }

        const today =
          state.simulatedDate

        if (
          state.streak
            .lastCompletedDate ===
          today
        ) {
          return
        }

        const isConsecutive =
          state.streak
            .lastCompletedDate ===
          shiftDate(today, -1)

        set((state) => ({
          streak: {
            current:
              isConsecutive
                ? state.streak.current +
                  1
                : 1,

            lastCompletedDate:
              today,
          },
        }))
      },

      // ==================================================
      // MISSION PROGRESS
      // ==================================================

      incrementMission: (
        missionId,
        target,
        reward
      ) => {
        const state = get()

        const mission =
          state.missionProgress[
            missionId
          ] || {
            current: 0,
            completed: false,
          }

        if (mission.completed) {
          return undefined
        }

        const newCurrent =
          Math.min(
            mission.current + 1,
            target
          )

        const justCompleted =
          newCurrent >= target

        set((state) => ({
          missionProgress: {
            ...state.missionProgress,

            [missionId]: {
              current: newCurrent,
              completed:
                justCompleted,
            },
          },
        }))

        if (justCompleted) {
          const paid =
            state.payReward(
              missionId,
              reward
            )

          state.checkStreak()

          return paid
        }

        return undefined
      },

      // ==================================================
      // TIMER MISSION
      // ==================================================

      setTimerProgress: (
        missionId,
        currentValue,
        target,
        reward
      ) => {
        const state = get()

        const mission =
          state.missionProgress[
            missionId
          ] || {
            current: 0,
            completed: false,
          }

        if (mission.completed) {
          return undefined
        }

        const clamped =
          Math.min(
            currentValue,
            target
          )

        const justCompleted =
          clamped >= target

        set((state) => ({
          missionProgress: {
            ...state.missionProgress,

            [missionId]: {
              current: clamped,
              completed:
                justCompleted,
            },
          },
        }))

        if (justCompleted) {
          const paid =
            state.payReward(
              missionId,
              reward
            )

          state.checkStreak()

          return paid
        }

        return undefined
      },

      // ==================================================
      // SCORES
      // ==================================================

      getMissionScore: (
        missionId
      ) => {
        const state = get()

        const def = state
          .getAllMissions()
          .find(
            (mission) =>
              mission.id ===
              missionId
          )

        if (!def) {
          return 0
        }

        const progress =
          state.missionProgress[
            missionId
          ] || {
            current: 0,
          }

        const target =
          state.customTargets[
            missionId
          ] || def.target

        const targetInProgressUnits =
          def.verificationType ===
          'timer'
            ? target * 60
            : target

        if (
          targetInProgressUnits <= 0
        ) {
          return 0
        }

        const percent =
          (progress.current /
            targetInProgressUnits) *
          100

        return Math.min(
          100,
          Math.round(percent)
        )
      },

      // ==================================================
      // WELLBEING
      // ==================================================

      getWellbeing: () => {
        const state = get()

        const scores =
          builtInMissions.map(
            (mission) =>
              state.getMissionScore(
                mission.id
              )
          )

        if (scores.length === 0) {
          return 0
        }

        const avg =
          scores.reduce(
            (sum, score) =>
              sum + score,
            0
          ) / scores.length

        return Math.round(avg)
      },

      getRollingWellbeing: (
        days = 3
      ) => {
        const state = get()

        let total =
          state.getWellbeing()

        for (
          let i = 1;
          i < days;
          i++
        ) {
          const day =
            shiftDate(
              state.simulatedDate,
              -i
            )

          total +=
            state.history?.[
              day
            ]?.wellbeing || 0
        }

        return Math.round(
          total / days
        )
      },

      // ==================================================
      // TESTING
      // ==================================================

      simulateNextDay: () => {
        set((state) => ({
          dayOffset:
            (state.dayOffset || 0) +
            1,
        }))

        get().syncDate()
      },

      // ==================================================
      // RESET
      // ==================================================

      resetGame: () =>
        set({


          currencies: { coolant: 0, cells: 0, shards: 0 },
          ownedThemes: ['default'],
          equippedTheme: 'default',
          ownedThemes: ['default'],
          equippedTheme: 'default',
          marketCredits: 1000,
          marketInventory: [],
          missionProgress: {
            water: { current: 0, completed: false },
            exercise: { current: 0, completed: false },
            sleep: { current: 0, completed: false },
          },

          marketInventory: [],

          shelterTheme:
            'classic',

          ownedShelterThemes: [
            'classic',
            'neon',
            'wasteland',
            'bio',
            'holo',
          ],

          featuredCurrencies: [],

          missionProgress: {
            water: {
              current: 0,
              completed: false,
            },

            exercise: {
              current: 0,
              completed: false,
            },

            sleep: {
              current: 0,
              completed: false,
            },
          },

          streak: {
            current: 0,
            lastCompletedDate:
              null,
          },

          simulatedDate:
            getDateString(new Date()),

          dayOffset: 0,

          history: {},

          customTargets: {},

          customMissions: [],

          customEarnedToday: 0,
          unlockedCompanionThemes: [],
          equippedCompanionTheme: null,
          unlockedCompanionThemes: [],
          equippedCompanionTheme: null,
        }),
    }),

    {
      name: 'havoc-game-storage',
    }
  )
)