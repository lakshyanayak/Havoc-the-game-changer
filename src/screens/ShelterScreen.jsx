import { motion } from 'framer-motion'
import {
  useGameStore,
  getMoodFromWellbeing,
} from '../store/gameStore'
import { SHELTER_BY_MOOD } from '../utils/shelterMood'
import { useState } from 'react'

const SHELTER_THEMES = {
  classic: {
    name: 'Classic',
    description: 'Calm shelter atmosphere',
    overlay: 'rgba(0, 0, 0, 0.08)',
    glow: 'rgba(34, 211, 238, 0.35)',
    accent: '#67e8f9',
  },

  neon: {
    name: 'Neon',
    description: 'Bright cyberpunk energy',
    overlay: 'rgba(88, 28, 135, 0.18)',
    glow: 'rgba(217, 70, 239, 0.55)',
    accent: '#e879f9',
  },

  wasteland: {
    name: 'Wasteland',
    description: 'Warm post-apocalypse mood',
    overlay: 'rgba(120, 53, 15, 0.22)',
    glow: 'rgba(251, 146, 60, 0.45)',
    accent: '#fb923c',
  },

  bio: {
    name: 'Bio',
    description: 'Living organic atmosphere',
    overlay: 'rgba(20, 83, 45, 0.2)',
    glow: 'rgba(74, 222, 128, 0.45)',
    accent: '#4ade80',
  },

  holo: {
    name: 'Holo',
    description: 'Futuristic holographic atmosphere',
    overlay: 'rgba(30, 64, 175, 0.2)',
    glow: 'rgba(96, 165, 250, 0.5)',
    accent: '#60a5fa',
  },

  sakura: {
    name: 'Sakura',
    description: 'Peaceful pink futuristic garden',
    overlay: 'rgba(157, 23, 77, 0.18)',
    glow: 'rgba(244, 114, 182, 0.5)',
    accent: '#f9a8d4',
  },

  ocean: {
    name: 'Ocean',
    description: 'Deep blue underwater atmosphere',
    overlay: 'rgba(7, 89, 133, 0.22)',
    glow: 'rgba(34, 211, 238, 0.5)',
    accent: '#67e8f9',
  },

  inferno: {
    name: 'Inferno',
    description: 'High-temperature volcanic shelter',
    overlay: 'rgba(127, 29, 29, 0.22)',
    glow: 'rgba(249, 115, 22, 0.55)',
    accent: '#fb923c',
  },

  moonlight: {
    name: 'Moonlight',
    description: 'Quiet midnight shelter',
    overlay: 'rgba(49, 46, 129, 0.22)',
    glow: 'rgba(129, 140, 248, 0.5)',
    accent: '#a5b4fc',
  },

  cyberCore: {
    name: 'Cyber Core',
    description: 'Advanced neon technology chamber',
    overlay: 'rgba(6, 78, 59, 0.2)',
    glow: 'rgba(45, 212, 191, 0.55)',
    accent: '#5eead4',
  },

  frozen: {
    name: 'Frozen',
    description: 'Cryogenic ice shelter',
    overlay: 'rgba(14, 116, 144, 0.18)',
    glow: 'rgba(125, 211, 252, 0.5)',
    accent: '#bae6fd',
  },

  toxicLab: {
    name: 'Toxic Lab',
    description: 'Dangerous experimental laboratory',
    overlay: 'rgba(54, 83, 20, 0.25)',
    glow: 'rgba(163, 230, 53, 0.5)',
    accent: '#bef264',
  },

  nightCity: {
    name: 'Night City',
    description: 'Massive futuristic city shelter',
    overlay: 'rgba(88, 28, 135, 0.22)',
    glow: 'rgba(167, 139, 250, 0.5)',
    accent: '#c4b5fd',
  },

  spaceStation: {
    name: 'Space Station',
    description: 'Orbiting shelter above the wasteland',
    overlay: 'rgba(30, 41, 59, 0.28)',
    glow: 'rgba(148, 163, 184, 0.5)',
    accent: '#e2e8f0',
  },

  alienWorld: {
    name: 'Alien World',
    description: 'Unknown world beyond the stars',
    overlay: 'rgba(88, 28, 135, 0.22)',
    glow: 'rgba(192, 132, 252, 0.5)',
    accent: '#d8b4fe',
  },

  crimson: {
    name: 'Crimson',
    description: 'Dark red survival atmosphere',
    overlay: 'rgba(127, 29, 29, 0.25)',
    glow: 'rgba(248, 113, 113, 0.5)',
    accent: '#fca5a5',
  },

  dreamscape: {
    name: 'Dreamscape',
    description: 'Surreal glowing dream environment',
    overlay: 'rgba(126, 34, 206, 0.18)',
    glow: 'rgba(232, 121, 249, 0.5)',
    accent: '#f0abfc',
  },

  ancientRuins: {
    name: 'Ancient Ruins',
    description: 'Lost civilization atmosphere',
    overlay: 'rgba(120, 53, 15, 0.22)',
    glow: 'rgba(251, 191, 36, 0.45)',
    accent: '#fcd34d',
  },

  stormCore: {
    name: 'Storm Core',
    description: 'Lightning-powered energy shelter',
    overlay: 'rgba(30, 64, 175, 0.22)',
    glow: 'rgba(96, 165, 250, 0.55)',
    accent: '#93c5fd',
  },

  glitchWorld: {
    name: 'Glitch World',
    description: 'Reality is breaking apart',
    overlay: 'rgba(88, 28, 135, 0.2)',
    glow: 'rgba(217, 70, 239, 0.55)',
    accent: '#f0abfc',
  },
}

function ShelterScreen() {
  const wellbeing = useGameStore((state) =>
    state.getWellbeing()
  )

  const mood = getMoodFromWellbeing(wellbeing)

  const shelter =
    SHELTER_BY_MOOD[mood]

  const shelterTheme = useGameStore(
    (state) => state.shelterTheme
  )

  const setShelterTheme = useGameStore(
    (state) => state.setShelterTheme
  )

  const ownedShelterThemes = useGameStore(
    (state) => state.ownedShelterThemes || [
      'classic',
      'neon',
      'wasteland',
      'bio',
      'holo',
    ]
  )

  const [showThemes, setShowThemes] =
    useState(false)

  const theme =
    SHELTER_THEMES[shelterTheme] ||
    SHELTER_THEMES.classic

  const particles = [
    { left: '10%', top: '25%', delay: 0 },
    { left: '22%', top: '55%', delay: 1.5 },
    { left: '38%', top: '35%', delay: 3 },
    { left: '55%', top: '65%', delay: 0.8 },
    { left: '72%', top: '30%', delay: 2 },
    { left: '86%', top: '58%', delay: 3.5 },
  ]

  const moodText = {
    Thriving: 'SYSTEM STATUS: EXCELLENT',
    Content: 'SYSTEM STATUS: STABLE',
    Neutral: 'SYSTEM STATUS: NORMAL',
    Low: 'SYSTEM STATUS: LOW ENERGY',
    Critical: 'SYSTEM STATUS: CRITICAL',
  }

  return (
    <div className="flex w-full justify-center bg-black">

      <div className="relative h-[calc(100svh-4rem)] min-h-[500px] w-full max-w-[460px] overflow-hidden bg-[#05070b]">

        {/* ORIGINAL SHELTER IMAGE */}

        <motion.img
          key={mood}
          src={shelter.image}
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.38 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
        />

        <motion.img
          key={`${mood}-full`}
          src={shelter.image}
          alt={`${shelter.label} shelter`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 h-full w-full object-contain"
        />

        {/* THEME */}

        <motion.div
          key={shelterTheme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: theme.overlay,
          }}
        />

        {/* GLOW */}

        <motion.div
          className="absolute left-1/2 top-24 h-32 w-32 -translate-x-1/2 rounded-full pointer-events-none"
          animate={{
            opacity: [0.25, 0.65, 0.3, 0.55, 0.25],
            scale: [0.9, 1.1, 0.95, 1.05, 0.9],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: theme.glow,
            filter: 'blur(35px)',
          }}
        />

        {/* PARTICLES */}

        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute h-1.5 w-1.5 rounded-full pointer-events-none"
            style={{
              left: particle.left,
              top: particle.top,
              background: theme.accent,
              boxShadow: `0 0 10px ${theme.glow}`,
            }}
            animate={{
              y: [-5, -25, -5],
              opacity: [0.15, 0.8, 0.15],
              scale: [0.7, 1.2, 0.7],
            }}
            transition={{
              duration: 4 + index * 0.5,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* HEADER */}

        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

        <div className="absolute inset-x-5 top-5 z-20 flex items-baseline justify-between gap-3">

          <span className="text-xs uppercase tracking-widest text-gray-300">
            Your Shelter
          </span>

          <span
            className="text-right text-sm font-semibold"
            style={{
              color: theme.accent,
            }}
          >
            {shelter.label} · {mood} {wellbeing}%
          </span>

        </div>

        {/* STATUS */}

        <motion.div
          className="absolute left-5 top-16 z-20 rounded-full border px-3 py-1"
          animate={{
            opacity: [0.55, 1, 0.55],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
          }}
          style={{
            borderColor: `${theme.accent}55`,
            background: 'rgba(0,0,0,0.5)',
          }}
        >
          <span
            className="text-[9px] font-mono tracking-widest"
            style={{
              color: theme.accent,
            }}
          >
            {moodText[mood]}
          </span>
        </motion.div>

        {/* THEME BUTTON */}

        <button
          type="button"
          onClick={() =>
            setShowThemes((current) => !current)
          }
          className="absolute right-5 top-16 z-30 rounded-full border px-3 py-2 text-xs font-semibold backdrop-blur-md transition active:scale-95"
          style={{
            borderColor: `${theme.accent}66`,
            background: 'rgba(0,0,0,0.65)',
            color: theme.accent,
          }}
        >
          🎨 THEME
        </button>

        {/* THEME PANEL */}

        {showThemes && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="absolute inset-x-4 top-28 z-40 max-h-[60vh] overflow-y-auto rounded-2xl border border-white/10 bg-black/95 p-4 shadow-2xl backdrop-blur-xl"
          >

            <div className="mb-3 flex items-center justify-between">

              <div>
                <div className="text-sm font-bold text-white">
                  Owned Themes
                </div>

                <div className="text-[10px] text-gray-400">
                  Buy more in Trading Centre
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowThemes(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-300"
              >
                ✕
              </button>

            </div>

            <div className="grid grid-cols-2 gap-2">

              {Object.entries(SHELTER_THEMES)
                .filter(([id]) =>
                  ownedShelterThemes.includes(id)
                )
                .map(([id, themeOption]) => {

                  const selected =
                    shelterTheme === id

                  return (
                    <button
                      type="button"
                      key={id}
                      onClick={() => {
                        setShelterTheme(id)
                        setShowThemes(false)
                      }}
                      className="rounded-xl border p-3 text-left transition active:scale-[0.97]"
                      style={{
                        borderColor: selected
                          ? themeOption.accent
                          : 'rgba(255,255,255,0.1)',

                        background: selected
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(255,255,255,0.04)',
                      }}
                    >

                      <div className="flex items-center justify-between">

                        <span className="text-lg">
                          {id === 'classic'
                            ? '🌌'
                            : id === 'neon'
                              ? '💜'
                              : id === 'wasteland'
                                ? '🏜️'
                                : id === 'bio'
                                  ? '🌿'
                                  : id === 'holo'
                                    ? '🔵'
                                    : '🎨'}
                        </span>

                        {selected && (
                          <span className="text-xs">
                            ✓
                          </span>
                        )}

                      </div>

                      <div
                        className="mt-2 text-xs font-bold"
                        style={{
                          color: themeOption.accent,
                        }}
                      >
                        {themeOption.name}
                      </div>

                      <div className="mt-1 text-[9px] leading-3 text-gray-400">
                        {themeOption.description}
                      </div>

                    </button>
                  )
                })}

            </div>

          </motion.div>
        )}

        {/* REMINDER */}

        <motion.div
          className="absolute bottom-24 left-4 z-20 max-w-[190px] rounded-2xl border border-white/10 bg-black/65 px-3 py-2 backdrop-blur-md"
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >

          <div className="flex items-start gap-2">

            <span className="text-lg">
              {mood === 'Thriving'
                ? '🌟'
                : mood === 'Content'
                  ? '✨'
                  : mood === 'Neutral'
                    ? '🌱'
                    : mood === 'Low'
                      ? '💙'
                      : '🫶'}
            </span>

            <div>

              <div
                className="text-[10px] font-bold"
                style={{
                  color: theme.accent,
                }}
              >
                SHELTER REMINDER
              </div>

              <div className="mt-0.5 text-[10px] leading-3 text-gray-300">
                {mood === 'Thriving'
                  ? 'Keep those good vibes going!'
                  : mood === 'Content'
                    ? 'You are doing pretty well.'
                    : mood === 'Neutral'
                      ? 'A little care can change the day.'
                      : mood === 'Low'
                        ? 'Your companion could use some care.'
                        : 'Complete a mission and help the shelter.'}
              </div>

            </div>

          </div>

        </motion.div>

        {/* BOTTOM STATUS */}

        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 px-4 py-3 backdrop-blur-md">

          <div>

            <div className="text-[9px] uppercase tracking-widest text-gray-500">
              Shelter Core
            </div>

            <motion.div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-white/10">

              <motion.div
                className="h-full rounded-full"
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${wellbeing}%`,
                }}
                transition={{
                  duration: 0.8,
                }}
                style={{
                  background: theme.accent,
                  boxShadow: `0 0 10px ${theme.glow}`,
                }}
              />

            </motion.div>

          </div>

          <motion.div
            animate={{
              rotate: [0, 4, -4, 0],
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-xl"
          >
            {mood === 'Thriving'
              ? '💚'
              : mood === 'Content'
                ? '💙'
                : mood === 'Neutral'
                  ? '💛'
                  : mood === 'Low'
                    ? '💜'
                    : '❤️'}
          </motion.div>

        </div>

      </div>

    </div>
  )
}

export default ShelterScreen