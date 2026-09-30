import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { SHELTER_THEMES } from '../utils/shelterTheme'
import { SHELTER_BY_MOOD } from '../utils/shelterMood'
import { currencyInfo } from '../data/currencies'

const categories = ['ALL', 'SURVIVAL', 'HEALTH', 'TECH']

const items = [
  { id: 1, name: 'Water', description: 'Purified water supply for long journeys.', price: 50, emoji: '💧', category: 'SURVIVAL', effect: '+15 ENERGY' },
  { id: 2, name: 'Energy Cell', description: 'High-density energy source for survival systems.', price: 120, emoji: '⚡', category: 'TECH', effect: '+30 ENERGY' },
  { id: 3, name: 'Med Kit', description: 'Emergency medical equipment for critical situations.', price: 150, emoji: '❤️', category: 'HEALTH', effect: '+25 HEALTH' },
  { id: 4, name: 'Shield', description: 'Portable protection system for dangerous missions.', price: 250, emoji: '🛡️', category: 'TECH', effect: 'MISSION PROTECTION' },
  { id: 5, name: 'Repair Kit', description: 'Advanced tools for repairing damaged equipment.', price: 180, emoji: '🔧', category: 'TECH', effect: 'REPAIR EQUIPMENT' },
  { id: 6, name: 'Data Chip', description: 'Encrypted data recovered from abandoned systems.', price: 300, emoji: '💾', category: 'TECH', effect: '+XP' },
  { id: 7, name: 'Emergency Ration', description: 'Compact food supply for survival situations.', price: 90, emoji: '🥫', category: 'SURVIVAL', effect: '+10 ENERGY' },
  { id: 8, name: 'Nano Booster', description: 'Experimental nanotechnology enhancement capsule.', price: 400, emoji: '🧬', category: 'HEALTH', effect: '+40 HEALTH' },
  { id: 9, name: 'Power Core', description: 'Rare high-output energy core.', price: 500, emoji: '🔋', category: 'TECH', effect: '+50 ENERGY' },
  { id: 10, name: 'Oxygen Tank', description: 'Portable oxygen supply for hazardous environments.', price: 220, emoji: '🫧', category: 'SURVIVAL', effect: 'SURVIVAL BOOST' },
  { id: 11, name: 'Bio Gel', description: 'Regenerative gel used by field medics.', price: 280, emoji: '🧪', category: 'HEALTH', effect: '+35 HEALTH' },
  { id: 12, name: 'Quantum Module', description: 'Extremely rare technology from the old world.', price: 750, emoji: '💠', category: 'TECH', effect: 'RARE UPGRADE' },
]

function TradingScreen() {
  const credits = useGameStore((state) => state.marketCredits)
  const inventory = useGameStore((state) => state.marketInventory || [])
  const purchaseMarketItem = useGameStore((state) => state.purchaseMarketItem)
  const currencies = useGameStore((state) => state.currencies)
  const ownedThemes = useGameStore((state) => state.ownedThemes || ['default'])
  const equippedTheme = useGameStore((state) => state.equippedTheme || 'default')
  const buyTheme = useGameStore((state) => state.buyTheme)
  const equipTheme = useGameStore((state) => state.equipTheme)
  const [category, setCategory] = useState('ALL')
  const [message, setMessage] = useState('')
  const filteredItems = category === 'ALL' ? items : items.filter((item) => item.category === category)

  function buyItem(item) {
    const purchased = purchaseMarketItem(item)
    setMessage(purchased ? `${item.name.toUpperCase()} ACQUIRED` : 'NOT ENOUGH CREDITS')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030509] text-white [background-image:radial-gradient(circle_at_10%_10%,rgba(0,255,255,0.08),transparent_25%),radial-gradient(circle_at_90%_20%,rgba(255,0,200,0.08),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(80,0,255,0.08),transparent_30%)]">
      <header className="relative z-10 flex flex-col gap-5 border-b border-cyan-300/20 bg-black/70 px-5 py-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center border border-cyan-300 text-2xl text-cyan-300 shadow-[0_0_15px_rgba(0,255,255,.2)]">◈</span>
          <div>
            <p className="text-[10px] uppercase tracking-[.22em] text-cyan-300">Black market // Online</p>
            <h1 className="mt-1 text-xl font-bold tracking-[.12em] sm:text-2xl">Trading Centre</h1>
            <p className="mt-1 text-[9px] uppercase tracking-[.2em] text-gray-500">Supplies · Upgrades · Survival</p>
          </div>
        </div>
        <div className="flex w-fit items-center gap-3 border border-fuchsia-400/50 bg-fuchsia-400/[.04] px-4 py-2.5 shadow-[0_0_18px_rgba(255,0,200,.1)]">
          <span className="text-2xl text-fuchsia-300" aria-hidden="true">₡</span>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-gray-400">Available credits</p>
            <strong className="text-xl tabular-nums">{credits}</strong>
          </div>
        </div>
      </header>

      <main className="relative z-[1] mx-auto w-full max-w-6xl px-5 pb-12 pt-8 sm:px-8 sm:pt-12">
        <section className="mb-8 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[.3em] text-cyan-300">Marketplace // 07</p>
            <h2 className="text-3xl font-bold uppercase leading-tight sm:text-5xl">
              Equip yourself.<br /><span className="text-cyan-300">Survive the unknown.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
              Access restricted supplies, advanced technology and survival equipment collected from across the wastelands.
            </p>
          </div>
          <div className="flex items-center gap-3 border border-white/10 px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#00ff9d]" />
            Market status <strong className="text-emerald-300">Online</strong>
          </div>
        </section>

        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter items by category">
          {categories.map((entry) => (
            <button
              key={entry}
              type="button"
              aria-pressed={category === entry}
              onClick={() => setCategory(entry)}
              className={`border px-4 py-2.5 text-[10px] font-semibold tracking-[.15em] transition-colors ${category === entry ? 'border-cyan-300 bg-cyan-300/10 text-cyan-200' : 'border-white/10 bg-black/30 text-gray-400 hover:border-cyan-300/60 hover:text-white'}`}
            >
              {entry}
            </button>
          ))}
        </div>

        {message && (
          <p role="status" aria-live="polite" className="mb-5 border-l-2 border-cyan-300 bg-cyan-300/[.05] px-4 py-3 text-xs uppercase tracking-widest text-cyan-200">
            {message}
          </p>
        )}

        <section aria-label="Marketplace items" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <article key={item.id} className="relative flex min-h-[270px] flex-col overflow-hidden border border-white/10 bg-gradient-to-br from-[#0f141f] to-[#05080d] p-5 transition-colors hover:border-cyan-300/60">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-fuchsia-400 opacity-60" />
              <div className="flex items-start justify-between">
                <span className="grid size-14 place-items-center border border-white/10 bg-black/40 text-3xl" aria-hidden="true">{item.emoji}</span>
                <span className="text-[9px] tracking-[.16em] text-gray-500">{item.category}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{item.name}</h3>
              <p className="mt-2 min-h-10 text-xs leading-relaxed text-gray-400">{item.description}</p>
              <div className="mt-4 flex items-center justify-between border-l-2 border-cyan-300 bg-cyan-300/[.04] px-3 py-2">
                <span className="text-[8px] tracking-widest text-gray-500">Effect</span>
                <strong className="text-[9px] tracking-wide text-cyan-200">{item.effect}</strong>
              </div>
              <div className="mt-auto flex items-center justify-between pt-5">
                <strong className="text-lg tabular-nums"><span className="mr-1 text-fuchsia-300">₡</span>{item.price}</strong>
                <button
                  type="button"
                  onClick={() => buyItem(item)}
                  className="border border-cyan-300 px-4 py-2.5 text-[9px] font-bold tracking-[.16em] text-cyan-200 transition-colors hover:bg-cyan-300 hover:text-black"
                >
                  Acquire
                </button>
              </div>
            </article>
          ))}
        </section>

        <section aria-label="Shelter themes" className="mt-14 border-t border-white/10 pt-8">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[.3em] text-fuchsia-300">Personalization // 03</p>
              <h2 className="text-2xl font-bold uppercase tracking-[.12em]">Shelter themes</h2>
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Theme currency balances">
              {Object.entries(currencyInfo).map(([currency, info]) => (
                <span key={currency} className="border border-white/10 bg-black/30 px-2.5 py-1.5 text-[10px] text-gray-300">
                  {info.icon} {currencies[currency] || 0} {info.label}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Object.values(SHELTER_THEMES).map((theme) => {
              const isOwned = ownedThemes.includes(theme.id)
              const isEquipped = equippedTheme === theme.id
              const canAfford = Object.entries(theme.cost).every(
                ([currency, amount]) => (currencies[currency] || 0) >= amount
              )
              const costLabel = Object.entries(theme.cost)
                .map(([currency, amount]) => `${amount} ${currencyInfo[currency]?.label || currency}`)
                .join(' + ')

              return (
                <article key={theme.id} className="flex min-h-[240px] flex-col border border-white/10 bg-gradient-to-br from-[#0f141f] to-[#05080d] p-4">
                  <div className="relative h-28 overflow-hidden border border-white/10 bg-black/40">
                    <img
                      src={SHELTER_BY_MOOD.Content.image}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-cover"
                      style={{ filter: theme.filter }}
                    />
                    <span className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 text-[9px] uppercase tracking-widest text-white">
                      {theme.name}
                    </span>
                  </div>
                  <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                    <div>
                      <h3 className="text-sm font-semibold">{theme.name}</h3>
                      <p className="mt-1 text-[10px] text-gray-400">
                        {isOwned ? 'Owned' : costLabel || 'No cost'}
                      </p>
                    </div>
                    {isOwned ? (
                      <button
                        type="button"
                        onClick={() => equipTheme(theme.id)}
                        disabled={isEquipped}
                        className="min-w-24 border border-cyan-300 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-cyan-200 transition-colors hover:bg-cyan-300 hover:text-black disabled:cursor-default disabled:border-emerald-400/50 disabled:text-emerald-300"
                      >
                        {isEquipped ? 'Equipped' : 'Equip'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const purchased = buyTheme(theme)
                          setMessage(purchased ? `${theme.name.toUpperCase()} ACQUIRED` : 'NOT ENOUGH CURRENCY')
                        }}
                        disabled={!canAfford}
                        className="min-w-24 border border-fuchsia-300 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-fuchsia-200 transition-colors hover:bg-fuchsia-300 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Buy
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mt-14 border-t border-white/10 pt-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[.3em] text-cyan-300">Player storage</p>
              <h2 className="text-2xl font-bold uppercase tracking-[.12em]">Inventory</h2>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-gray-500">{inventory.length} items</span>
          </div>
          {inventory.length === 0 ? (
            <div className="border border-dashed border-white/15 px-5 py-10 text-center">
              <p className="text-2xl text-cyan-300" aria-hidden="true">◇</p>
              <p className="mt-3 text-xs uppercase tracking-widest text-gray-400">Inventory empty</p>
              <p className="mt-2 text-[10px] text-gray-500">Purchase supplies from the marketplace.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {inventory.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center gap-3 border border-white/10 bg-black/30 p-3">
                  <span className="text-2xl" aria-hidden="true">{item.emoji}</span>
                  <strong className="text-xs">{item.name}</strong>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="flex flex-col gap-2 border-t border-white/10 px-5 py-5 text-[8px] uppercase tracking-[.16em] text-gray-600 sm:flex-row sm:justify-between sm:px-8">
        <span>Trading network // Secure connection</span>
        <span>Status: Active</span>
      </footer>
    </div>
  )
}

export default TradingScreen