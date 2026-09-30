import { useState, useEffect, useRef } from 'react'
import MissionsScreen from './screens/MissionsScreen'
import ShelterScreen from './screens/ShelterScreen'
import CompanionScreen from './screens/CompanionScreen'
import TradingScreen from './screens/TradingScreen'
import IntroScreen from './screens/IntroScreen'
import LoginScreen from './screens/login_page'
import { useDaySync } from './utils/useDaySync'
import { useGameStore } from './store/gameStore'

const tabs = [
  { id: 'shelter', label: 'Shelter', icon: '🏚️' },
  { id: 'companion', label: 'Companion', icon: '🤖' },
  { id: 'missions', label: 'Missions', icon: '🎯' },
  { id: 'trading', label: 'Trading', icon: '⚖️' },
]

const INTRO_SEEN_KEY = 'havoc_login_intro_seen'

function getSeenIntroPlayers() {
  try {
    const savedPlayers = JSON.parse(localStorage.getItem(INTRO_SEEN_KEY) || '[]')
    return Array.isArray(savedPlayers) ? savedPlayers : []
  } catch {
    return []
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('missions')
  const playerName = useGameStore((state) => state.playerName)
  const companionName = useGameStore((state) => state.companionName?.trim() || 'Companion')
  const playerKey = playerName?.trim().toLowerCase()
  const [seenIntroPlayers, setSeenIntroPlayers] = useState(getSeenIntroPlayers)
  const [musicEnabled, setMusicEnabled] = useState(false)
  const musicRef = useRef(null)
  const showIntro = Boolean(playerKey) && !seenIntroPlayers.includes(playerKey)

  useDaySync()

  useEffect(() => {
    const audio = musicRef.current
    if (!audio) return

    if (!playerName || showIntro) {
      audio.pause()
    } else if (musicEnabled) {
      audio.play().catch(() => setMusicEnabled(false))
    }
  }, [playerName, showIntro, musicEnabled])

  function toggleMusic() {
    const audio = musicRef.current
    if (!audio) return

    if (musicEnabled) {
      audio.pause()
      setMusicEnabled(false)
      return
    }

    audio.play()
      .then(() => setMusicEnabled(true))
      .catch(() => setMusicEnabled(false))
  }

  function handleIntroFinish() {
    if (!playerKey || seenIntroPlayers.includes(playerKey)) return

    const updatedSeenPlayers = [...seenIntroPlayers, playerKey]
    localStorage.setItem(INTRO_SEEN_KEY, JSON.stringify(updatedSeenPlayers))
    setSeenIntroPlayers(updatedSeenPlayers)
  }

  return (
    <>
      <audio ref={musicRef} src="/background-music.mp3" loop preload="auto" />
      {!playerName ? (
        <LoginScreen />
      ) : showIntro ? (
        <IntroScreen onFinish={handleIntroFinish} />
      ) : (
        <div className="min-h-screen bg-black">
          <div className="relative pb-16">
            {activeTab === 'shelter' && <ShelterScreen />}
            {activeTab === 'companion' && (
              <>
                <ShelterScreen />
                <CompanionScreen />
              </>
            )}
            {activeTab === 'missions' && <MissionsScreen />}
            {activeTab === 'trading' && <TradingScreen />}

            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 flex bg-black/85 backdrop-blur border-t border-white/10">
              {tabs.map((tab) => {
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
                      active ? 'text-cyan-300' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <span
                      className={`text-lg leading-none ${
                        active ? 'drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]' : ''
                      }`}
                    >
                      {tab.icon}
                    </span>
                    {tab.id === 'companion' ? companionName : tab.label}
                  </button>
                )
              })}
              <button
                onClick={toggleMusic}
                aria-label={musicEnabled ? 'Mute music' : 'Play music'}
                aria-pressed={musicEnabled}
                title={musicEnabled ? 'Mute music' : 'Play music'}
                className="w-14 shrink-0 py-2.5 flex flex-col items-center gap-0.5 text-xs font-medium text-gray-300 hover:text-white transition-colors"
              >
                <span className="text-lg leading-none" aria-hidden="true">
                  {musicEnabled ? '🔊' : '🔇'}
                </span>
                Music
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default App