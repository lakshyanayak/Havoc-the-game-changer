import { useState } from 'react'
import TradingScreen from './screens/TradingScreen'
import MissionsScreen from './screens/MissionsScreen'
import CompanionScreen from './screens/CompanionScreen'
import ShelterScreen from './screens/ShelterScreen'
import { useDaySync } from './utils/useDaySync'
import LoginScreen from './screens/login_page'
import { useGameStore } from './store/gameStore'

const tabs = [
  { id: 'shelter', label: 'Shelter', icon: '🏚️' },
  { id: 'companion', label: 'Companion', icon: '🤖' },
  { id: 'missions', label: 'Missions', icon: '🎯' },
  { id: 'trading', label: 'Trading', icon: '⚖️' },
]

function App() {
  const [activeTab, setActiveTab] = useState('missions')
  const [showCompanion, setShowCompanion] = useState(false)
  const playerName = useGameStore((state) => state.playerName)
  const companionName = useGameStore((state) => state.companionName?.trim() || 'Companion')
  // Runs the new-day check on every tab, not just Missions
  useDaySync()

  if (!playerName) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="relative">
        {activeTab === 'shelter' && <ShelterScreen />}
        {activeTab === 'missions' && <MissionsScreen />}
        {activeTab === 'trading' && <TradingScreen />}
        {showCompanion && <CompanionScreen />}

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 flex bg-black/85 backdrop-blur border-t border-white/10">
          {tabs.map((tab) => {
            const isCompanionTab = tab.id === 'companion'
            const active = isCompanionTab ? showCompanion : activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  if (isCompanionTab) setShowCompanion((visible) => !visible)
                  else setActiveTab(tab.id)
                }}
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
                  {isCompanionTab ? companionName : tab.label}
                </span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default App