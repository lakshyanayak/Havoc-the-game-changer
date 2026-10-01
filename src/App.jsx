import { useEffect, useRef, useState } from 'react'
import CompanionScreen from './screens/CompanionScreen'
import IntroScreen from './screens/IntroScreen'
import LoginScreen from './screens/login_page'
import MissionsScreen from './screens/MissionsScreen'
import ShelterScreen from './screens/ShelterScreen'
import TradingScreen from './screens/TradingScreen'
import { useGameStore } from './store/gameStore'
import { useDaySync } from './utils/useDaySync'

const tabs = [
  { id: 'shelter', label: 'Shelter', icon: '🏚️' },
  { id: 'companion', label: 'Companion', icon: '🤖' },
  { id: 'missions', label: 'Missions', icon: '🎯' },
  { id: 'trading', label: 'Trading', icon: '⚖️' },
]

const INTRO_SEEN_KEY = 'havoc_intro_seen'

function getIntroSeen() {
  try {
    return localStorage.getItem(INTRO_SEEN_KEY) === 'true'
  } catch {
    return false
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('missions')
  const [introSeen, setIntroSeen] = useState(getIntroSeen)
  const [replayIntro, setReplayIntro] = useState(
    () => !useGameStore.getState().playerName,
  )
  const [musicEnabled, setMusicEnabled] = useState(false)
  const musicRef = useRef(null)
  const playerName = useGameStore((state) => state.playerName)
  const companionName = useGameStore((state) => state.companionName?.trim() || 'Companion')
  const showIntro = !introSeen || replayIntro

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
    try {
      localStorage.setItem(INTRO_SEEN_KEY, 'true')
    } catch {
      // Keep the current session flow working if storage is unavailable.
    }
    setIntroSeen(true)
    setReplayIntro(false)
  }

  function handleLogout() {
    try {
      localStorage.removeItem(INTRO_SEEN_KEY)
    } catch {
      // Keep logout working if storage is unavailable.
    }
    setIntroSeen(false)
    setReplayIntro(true)
    useGameStore.getState().logout()
  }

  return (
    <>
      <audio ref={musicRef} src="/background-music.mp3" loop preload="auto" />
      {showIntro ? (
        <IntroScreen onFinish={handleIntroFinish} />
      ) : !playerName ? (
        <LoginScreen />
      ) : (
        <div className="min-h-screen bg-black">
          <div className="relative pb-16">
            {activeTab === 'shelter' && <ShelterScreen />}
            {activeTab === 'companion' && <CompanionScreen />}
            {activeTab === 'missions' && (
              <MissionsScreen
                onPlayWelcome={() => setReplayIntro(true)}
                onLogout={handleLogout}
              />
            )}
            {activeTab === 'trading' && <TradingScreen />}

            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 flex bg-black/85 backdrop-blur border-t border-white/10">
              {tabs.map((tab) => {
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-pressed={active}
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
                    <span className="max-w-full truncate px-1">
                      {tab.id === 'companion' ? companionName : tab.label}
                    </span>
                  </button>
                )
              })}
              <button
                type="button"
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