import { useState } from 'react'
import { useGameStore } from '../store/gameStore'

const BUILT_IN_CURRENCIES = ['coolant', 'cells', 'shards']

const CURRENCY_INFO = {
  coolant: {
    name: 'Coolant',
    emoji: '💧',
  },
  cells: {
    name: 'Cells',
    emoji: '⚡',
  },
  shards: {
    name: 'Shards',
    emoji: '💎',
  },
}

const categories = [
  'ALL',
  'SURVIVAL',
  'HEALTH',
  'TECH',
  'SHELTER',
]

const baseItems = [
  {
    id: 'water',
    name: 'Water',
    description: 'Purified water supply for long journeys.',
    emoji: '💧',
    category: 'SURVIVAL',
    effect: '+15 ENERGY',
    baseCost: {
      coolant: 2,
      shards: 1,
    },
  },

  {
    id: 'energy-cell',
    name: 'Energy Cell',
    description: 'High-density energy source for survival systems.',
    emoji: '⚡',
    category: 'TECH',
    effect: '+30 ENERGY',
    baseCost: {
      cells: 3,
      coolant: 1,
    },
  },

  {
    id: 'med-kit',
    name: 'Med Kit',
    description: 'Emergency medical equipment for critical situations.',
    emoji: '❤️',
    category: 'HEALTH',
    effect: '+25 HEALTH',
    baseCost: {
      coolant: 2,
      shards: 2,
    },
  },

  {
    id: 'shield',
    name: 'Shield',
    description: 'Portable protection system for dangerous missions.',
    emoji: '🛡️',
    category: 'TECH',
    effect: 'MISSION PROTECTION',
    baseCost: {
      cells: 4,
      shards: 2,
    },
  },

  {
    id: 'repair-kit',
    name: 'Repair Kit',
    description: 'Advanced tools for repairing damaged equipment.',
    emoji: '🔧',
    category: 'TECH',
    effect: 'REPAIR EQUIPMENT',
    baseCost: {
      cells: 2,
      coolant: 3,
    },
  },

  {
    id: 'data-chip',
    name: 'Data Chip',
    description: 'Encrypted data recovered from abandoned systems.',
    emoji: '💾',
    category: 'TECH',
    effect: '+XP',
    baseCost: {
      shards: 5,
      cells: 2,
    },
  },

  {
    id: 'emergency-ration',
    name: 'Emergency Ration',
    description: 'Compact food supply for survival situations.',
    emoji: '🥫',
    category: 'SURVIVAL',
    effect: '+10 ENERGY',
    baseCost: {
      coolant: 2,
      cells: 1,
    },
  },

  {
    id: 'nano-booster',
    name: 'Nano Booster',
    description: 'Experimental nanotechnology enhancement capsule.',
    emoji: '🧬',
    category: 'HEALTH',
    effect: '+40 HEALTH',
    baseCost: {
      shards: 4,
      coolant: 3,
    },
  },

  {
    id: 'power-core',
    name: 'Power Core',
    description: 'Rare high-output energy core.',
    emoji: '🔋',
    category: 'TECH',
    effect: '+50 ENERGY',
    baseCost: {
      cells: 5,
      coolant: 2,
      shards: 1,
    },
  },

  {
    id: 'oxygen-tank',
    name: 'Oxygen Tank',
    description: 'Portable oxygen supply for hazardous environments.',
    emoji: '🫧',
    category: 'SURVIVAL',
    effect: 'SURVIVAL BOOST',
    baseCost: {
      coolant: 4,
      cells: 2,
    },
  },

  {
    id: 'bio-gel',
    name: 'Bio Gel',
    description: 'Regenerative gel used by field medics.',
    emoji: '🧪',
    category: 'HEALTH',
    effect: '+35 HEALTH',
    baseCost: {
      coolant: 3,
      shards: 3,
    },
  },

  {
    id: 'quantum-module',
    name: 'Quantum Module',
    description: 'Extremely rare technology from the old world.',
    emoji: '💠',
    category: 'TECH',
    effect: 'RARE UPGRADE',
    baseCost: {
      cells: 6,
      shards: 5,
      coolant: 3,
    },
  },
]

const shelterThemes = [
  {
    id: 'sakura',
    name: 'Sakura Haven',
    emoji: '🌸',
    description: 'A calm sanctuary surrounded by luminous petals.',
    cost: {
      shards: 4,
      coolant: 3,
    },
  },

  {
    id: 'ocean',
    name: 'Deep Ocean',
    emoji: '🌊',
    description: 'A deep-water shelter with blue atmospheric lighting.',
    cost: {
      coolant: 5,
      cells: 2,
    },
  },

  {
    id: 'inferno',
    name: 'Inferno',
    emoji: '🔥',
    description: 'A heated volcanic shelter for extreme zones.',
    cost: {
      cells: 5,
      shards: 3,
    },
  },

  {
    id: 'moonlight',
    name: 'Moonlight',
    emoji: '🌙',
    description: 'A quiet shelter illuminated by cold lunar light.',
    cost: {
      shards: 5,
      coolant: 2,
    },
  },

  {
    id: 'cyberCore',
    name: 'Cyber Core',
    emoji: '💻',
    description: 'A high-tech shelter powered by neon systems.',
    cost: {
      cells: 5,
      coolant: 3,
    },
  },

  {
    id: 'frozen',
    name: 'Frozen Vault',
    emoji: '❄️',
    description: 'A reinforced shelter designed for frozen zones.',
    cost: {
      coolant: 6,
      shards: 2,
    },
  },

  {
    id: 'toxicLab',
    name: 'Toxic Lab',
    emoji: '☣️',
    description: 'A sealed laboratory for dangerous environments.',
    cost: {
      cells: 4,
      coolant: 4,
      shards: 2,
    },
  },

  {
    id: 'nightCity',
    name: 'Night City',
    emoji: '🌃',
    description: 'A neon-lit urban shelter hidden among ruins.',
    cost: {
      cells: 5,
      shards: 4,
    },
  },

  {
    id: 'spaceStation',
    name: 'Space Station',
    emoji: '🛰️',
    description: 'A futuristic shelter beyond the wasteland.',
    cost: {
      cells: 6,
      shards: 5,
      coolant: 3,
    },
  },

  {
    id: 'alienWorld',
    name: 'Alien World',
    emoji: '👽',
    description: 'An otherworldly shelter from an unknown planet.',
    cost: {
      shards: 7,
      cells: 4,
    },
  },

  {
    id: 'crimson',
    name: 'Crimson Base',
    emoji: '🟥',
    description: 'A fortified red-lit survival base.',
    cost: {
      coolant: 4,
      shards: 5,
    },
  },

  {
    id: 'dreamscape',
    name: 'Dreamscape',
    emoji: '✨',
    description: 'A surreal shelter filled with futuristic light.',
    cost: {
      shards: 6,
      coolant: 4,
    },
  },

  {
    id: 'ancientRuins',
    name: 'Ancient Ruins',
    emoji: '🏛️',
    description: 'A mysterious shelter inside forgotten ruins.',
    cost: {
      coolant: 5,
      shards: 5,
    },
  },

  {
    id: 'stormCore',
    name: 'Storm Core',
    emoji: '⚡',
    description: 'A shelter powered by atmospheric energy.',
    cost: {
      cells: 6,
      coolant: 4,
    },
  },

  {
    id: 'glitchWorld',
    name: 'Glitch World',
    emoji: '🌀',
    description: 'A strange digital shelter where reality shifts.',
    cost: {
      cells: 5,
      shards: 6,
      coolant: 2,
    },
  },
]

const freeThemes = [
  {
    id: 'classic',
    name: 'Classic',
    emoji: '🏠',
  },
  {
    id: 'neon',
    name: 'Neon',
    emoji: '💡',
  },
  {
    id: 'wasteland',
    name: 'Wasteland',
    emoji: '🏜️',
  },
  {
    id: 'bio',
    name: 'Bio',
    emoji: '🌿',
  },
  {
    id: 'holo',
    name: 'Holo',
    emoji: '🔷',
  },
]

function getCurrencyInfo(currency) {
  if (CURRENCY_INFO[currency]) {
    return CURRENCY_INFO[currency]
  }

  return {
    name: currency
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase()),
    emoji: '🪙',
  }
}

function formatCost(cost) {
  return Object.entries(cost)
    .map(([currency, amount]) => {
      const info = getCurrencyInfo(currency)

      return `${amount} ${info.emoji} ${info.name}`
    })
    .join(' + ')
}

function createCustomPrice(item, selectedCustomCurrencies) {
  if (selectedCustomCurrencies.length === 0) {
    return item.baseCost
  }

  /*
    Most normal items keep their normal mixed built-in price.

    A few special items additionally require one of the
    player's selected custom currencies.
  */

  const customIndex =
    item.id.length % selectedCustomCurrencies.length

  const customCurrency =
    selectedCustomCurrencies[customIndex]

  if (
    item.id === 'data-chip' ||
    item.id === 'quantum-module' ||
    item.id === 'nano-booster'
  ) {
    return {
      ...item.baseCost,
      [customCurrency]: item.id === 'quantum-module' ? 2 : 1,
    }
  }

  return item.baseCost
}

function TradingScreen() {
  const currencies = useGameStore(
    (state) => state.currencies || {}
  )

  const featuredCurrencies = useGameStore(
    (state) => state.featuredCurrencies || []
  )

  const toggleFeaturedCurrency = useGameStore(
    (state) => state.toggleFeaturedCurrency
  )

  const inventory = useGameStore(
    (state) => state.marketInventory || []
  )

  const purchaseMarketItem = useGameStore(
    (state) => state.purchaseMarketItem
  )

  const ownedShelterThemes = useGameStore(
    (state) =>
      state.ownedShelterThemes || [
        'classic',
        'neon',
        'wasteland',
        'bio',
        'holo',
      ]
  )

  const purchaseShelterTheme = useGameStore(
    (state) => state.purchaseShelterTheme
  )

  const [category, setCategory] = useState('ALL')
  const [message, setMessage] = useState('')

  /*
    Only custom currencies are selectable.
    Coolant / Cells / Shards are automatically included.
  */

  const customCurrencies = Object.keys(currencies).filter(
    (currency) =>
      !BUILT_IN_CURRENCIES.includes(currency)
  )

  const filteredItems =
    category === 'ALL'
      ? baseItems
      : baseItems.filter(
          (item) => item.category === category
        )

  function selectCustomCurrency(currency) {
    toggleFeaturedCurrency(currency)
  }

  function buyItem(item) {
    const cost = createCustomPrice(
      item,
      featuredCurrencies
    )

    const purchased = purchaseMarketItem({
      ...item,
      cost,
    })

    if (purchased) {
      setMessage(
        `✓ ${item.name.toUpperCase()} ACQUIRED`
      )
    } else {
      setMessage(
        `✕ NOT ENOUGH CURRENCY FOR ${item.name.toUpperCase()}`
      )
    }
  }

  function buyTheme(theme) {
    if (ownedShelterThemes.includes(theme.id)) {
      setMessage(
        `${theme.name.toUpperCase()} ALREADY OWNED`
      )
      return
    }

    const purchased = purchaseShelterTheme(theme)

    if (purchased) {
      setMessage(
        `✓ ${theme.name.toUpperCase()} UNLOCKED`
      )
    } else {
      setMessage(
        `✕ NOT ENOUGH CURRENCY FOR ${theme.name.toUpperCase()}`
      )
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#030509] text-white">
      <div className="mx-auto w-full max-w-[460px]">

        {/* HEADER */}
        <header className="border-b border-cyan-300/20 bg-black/80 px-5 py-5">
          <div className="flex items-center gap-4">
            <div className="grid size-12 shrink-0 place-items-center border border-cyan-300 text-2xl text-cyan-300">
              ◈
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[.25em] text-cyan-300">
                HAVOC // MARKET
              </p>

              <h1 className="mt-1 text-xl font-bold uppercase tracking-[.08em]">
                Trading Centre
              </h1>

              <p className="mt-1 text-[9px] uppercase tracking-[.16em] text-gray-500">
                Supplies · Technology · Shelter
              </p>
            </div>
          </div>
        </header>

        {/* WALLET */}
        <section className="border-b border-white/10 bg-[#070b12] px-5 py-4">
          <p className="mb-3 text-[9px] uppercase tracking-[.25em] text-gray-500">
            Currency Reserves
          </p>

          <div className="grid grid-cols-3 gap-2">
            {BUILT_IN_CURRENCIES.map((currency) => {
              const info = getCurrencyInfo(currency)

              return (
                <div
                  key={currency}
                  className="border border-white/10 bg-white/[.025] p-3"
                >
                  <div className="text-lg">
                    {info.emoji}
                  </div>

                  <p className="mt-1 text-[8px] uppercase tracking-widest text-gray-500">
                    {info.name}
                  </p>

                  <strong className="text-lg text-cyan-300">
                    {currencies[currency] || 0}
                  </strong>
                </div>
              )
            })}
          </div>

          {/* CUSTOM CURRENCIES */}
          {customCurrencies.length > 0 && (
            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[9px] uppercase tracking-[.25em] text-fuchsia-300">
                    Custom Currency
                  </p>

                  <p className="mt-1 text-[10px] text-gray-500">
                    Select up to 3 currencies to use in Trading.
                  </p>
                </div>

                <span className="text-[9px] text-gray-500">
                  {featuredCurrencies.length}/3
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {customCurrencies.map((currency) => {
                  const info =
                    getCurrencyInfo(currency)

                  const selected =
                    featuredCurrencies.includes(
                      currency
                    )

                  return (
                    <button
                      key={currency}
                      type="button"
                      onClick={() =>
                        selectCustomCurrency(
                          currency
                        )
                      }
                      className={`flex w-full items-center justify-between border px-3 py-3 text-left transition ${
                        selected
                          ? 'border-fuchsia-300 bg-fuchsia-300/10'
                          : 'border-white/10 bg-white/[.02]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {info.emoji}
                        </span>

                        <div>
                          <p
                            className={`text-xs font-semibold ${
                              selected
                                ? 'text-fuchsia-200'
                                : 'text-white'
                            }`}
                          >
                            {info.name}
                          </p>

                          <p className="text-[9px] text-gray-500">
                            Balance:{' '}
                            {currencies[currency] ||
                              0}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`grid size-6 place-items-center border text-xs ${
                          selected
                            ? 'border-fuchsia-300 text-fuchsia-300'
                            : 'border-gray-700 text-gray-700'
                        }`}
                      >
                        {selected ? '✓' : ''}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        {/* CONTENT */}
        <main className="px-5 pb-12 pt-7">

          <p className="text-[9px] uppercase tracking-[.3em] text-cyan-300">
            Marketplace
          </p>

          <h2 className="mt-2 text-3xl font-bold uppercase leading-tight">
            Equip yourself.
            <br />
            <span className="text-cyan-300">
              Survive the unknown.
            </span>
          </h2>

          <p className="mt-3 text-xs leading-relaxed text-gray-400">
            Trade resources recovered through missions
            for supplies and upgrades.
          </p>

          {/* CATEGORY */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => setCategory(entry)}
                className={`border px-3 py-2 text-[9px] font-semibold tracking-[.12em] ${
                  category === entry
                    ? 'border-cyan-300 bg-cyan-300/10 text-cyan-200'
                    : 'border-white/10 text-gray-500'
                }`}
              >
                {entry}
              </button>
            ))}
          </div>

          {/* MESSAGE */}
          {message && (
            <div className="mt-4 border-l-2 border-cyan-300 bg-cyan-300/[.05] px-3 py-3 text-[9px] uppercase tracking-widest text-cyan-200">
              {message}
            </div>
          )}

          {/* ITEMS */}
          {category !== 'SHELTER' && (
            <section className="mt-5 space-y-3">
              {filteredItems.map((item) => {
                const cost = createCustomPrice(
                  item,
                  featuredCurrencies
                )

                return (
                  <article
                    key={item.id}
                    className="border border-white/10 bg-[#080c13] p-4"
                  >
                    <div className="flex gap-4">
                      <div className="grid size-14 shrink-0 place-items-center border border-white/10 bg-white/[.03] text-2xl">
                        {item.emoji}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-bold uppercase">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-[9px] uppercase tracking-wider text-cyan-300">
                              {item.category}
                            </p>
                          </div>

                          <span className="shrink-0 text-[8px] text-gray-600">
                            {item.effect}
                          </span>
                        </div>

                        <p className="mt-3 text-[10px] leading-relaxed text-gray-500">
                          {item.description}
                        </p>

                        <div className="mt-4 border-t border-white/10 pt-3">
                          <p className="text-[8px] uppercase tracking-widest text-gray-600">
                            Cost
                          </p>

                          <p className="mt-1 text-[10px] font-semibold text-yellow-200">
                            {formatCost(cost)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            buyItem(item)
                          }
                          className="mt-3 w-full border border-cyan-300/50 bg-cyan-300/[.06] py-3 text-[9px] font-bold uppercase tracking-[.2em] text-cyan-200"
                        >
                          Acquire
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </section>
          )}

          {/* SHELTER */}
          {category === 'SHELTER' && (
            <section className="mt-5">

              <div className="mb-5 border border-cyan-300/20 bg-cyan-300/[.03] p-4">
                <p className="text-[9px] uppercase tracking-[.25em] text-cyan-300">
                  Shelter Themes
                </p>

                <p className="mt-2 text-[10px] leading-relaxed text-gray-500">
                  Your shelter is already alive through its
                  mood and atmosphere. Unlock new visual
                  worlds using your resources.
                </p>
              </div>

              {/* FREE THEMES */}
              <div>
                <p className="mb-3 text-[9px] uppercase tracking-[.2em] text-gray-500">
                  Available
                </p>

                <div className="space-y-2">
                  {freeThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className="flex items-center justify-between border border-white/10 bg-[#080c13] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {theme.emoji}
                        </span>

                        <div>
                          <p className="text-xs font-bold uppercase">
                            {theme.name}
                          </p>

                          <p className="mt-1 text-[9px] text-gray-500">
                            Free default theme
                          </p>
                        </div>
                      </div>

                      <span className="text-[9px] font-bold text-green-400">
                        OWNED
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PAID THEMES */}
              <div className="mt-7">
                <p className="mb-3 text-[9px] uppercase tracking-[.2em] text-fuchsia-300">
                  Premium Themes
                </p>

                <div className="space-y-3">
                  {shelterThemes.map((theme) => {
                    const owned =
                      ownedShelterThemes.includes(
                        theme.id
                      )

                    return (
                      <article
                        key={theme.id}
                        className="border border-white/10 bg-[#080c13] p-4"
                      >
                        <div className="flex gap-3">
                          <div className="grid size-12 shrink-0 place-items-center border border-fuchsia-300/20 bg-fuchsia-300/[.04] text-2xl">
                            {theme.emoji}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between gap-3">
                              <div>
                                <h3 className="text-xs font-bold uppercase">
                                  {theme.name}
                                </h3>

                                <p className="mt-1 text-[9px] leading-relaxed text-gray-500">
                                  {theme.description}
                                </p>
                              </div>

                              {owned && (
                                <span className="text-[8px] font-bold text-green-400">
                                  OWNED
                                </span>
                              )}
                            </div>

                            {!owned && (
                              <>
                                <p className="mt-3 text-[9px] font-semibold text-yellow-200">
                                  {formatCost(
                                    theme.cost
                                  )}
                                </p>

                                <button
                                  type="button"
                                  onClick={() =>
                                    buyTheme(theme)
                                  }
                                  className="mt-3 w-full border border-fuchsia-300/40 bg-fuchsia-300/[.05] py-3 text-[9px] font-bold uppercase tracking-[.18em] text-fuchsia-200"
                                >
                                  Unlock Theme
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {/* INVENTORY COUNT */}
          <div className="mt-8 border-t border-white/10 pt-5">
            <div className="flex justify-between text-[9px] uppercase tracking-widest text-gray-600">
              <span>Acquired Items</span>
              <span>{inventory.length}</span>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

export default TradingScreen