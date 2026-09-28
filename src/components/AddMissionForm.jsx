import { useState } from 'react'
import { getIconForActivity } from '../utils/iconMatcher'
import { CUSTOM_REWARD_MAX, CUSTOM_DAILY_CAP } from '../data/rules'
import { currencyInfo } from '../data/currencies'

function AddMissionForm({ existingCurrencies, onAdd, onCancel }) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🎯')
  const [iconManuallySet, setIconManuallySet] = useState(false)
  const [verificationType, setVerificationType] = useState('manual')
  const [target, setTarget] = useState(1)
  const [unit, setUnit] = useState('')
  const [currencyMode, setCurrencyMode] = useState(existingCurrencies[0] || 'coolant')
  const [newCurrencyName, setNewCurrencyName] = useState('')
  const [amount, setAmount] = useState(3)

  function handleNameChange(e) {
    const newName = e.target.value
    setName(newName)
    if (!iconManuallySet) {
      setIcon(getIconForActivity(newName))
    }
  }

  function handleIconChange(e) {
    setIcon(e.target.value)
    setIconManuallySet(true)
  }

  function handleAmountChange(e) {
    // Never let the typed value go above the per-mission cap
    setAmount(Math.min(Number(e.target.value), CUSTOM_REWARD_MAX))
  }

  function handleSubmit() {
    const finalUnit = verificationType === 'timer' ? 'minutes' : unit.trim()
    const currency = currencyMode === '__new__' ? newCurrencyName.trim() : currencyMode

    if (!name.trim() || !finalUnit || !currency || Number(target) <= 0 || Number(amount) <= 0) {
      alert('Please fill in a name, unit, currency, and positive target/reward amount.')
      return
    }

    onAdd({
      name: name.trim(),
      icon,
      description: `Custom mission: ${name.trim()}`,
      verificationType,
      target: Number(target),
      unit: finalUnit,
      currency,
      amount: Math.min(Number(amount), CUSTOM_REWARD_MAX),
    })
  }

  return (
    <div className="bg-gray-900 border border-purple-500 rounded-xl p-4 mb-4">
      <h3 className="font-bold mb-3">Create Custom Mission</h3>

      <div className="flex flex-col gap-2 text-sm">
        <label>
          Name
          <input
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Read a book, Morning run"
            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1"
          />
        </label>

        <label>
          Icon <span className="text-gray-500">(auto-detected — edit to override)</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl">{icon}</span>
            <input
              value={icon}
              onChange={handleIconChange}
              className="w-16 bg-gray-800 border border-gray-600 rounded px-2 py-1"
            />
          </div>
        </label>

        <label>
          Verification type
          <select
            value={verificationType}
            onChange={(e) => setVerificationType(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1"
          >
            <option value="manual">Manual (click to log progress)</option>
            <option value="timer">Timer (start/pause/stop)</option>
          </select>
        </label>

        <label>
          Target {verificationType === 'timer' ? '(minutes)' : ''}
          <input
            type="number"
            min="1"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1"
          />
        </label>

        {verificationType === 'manual' && (
          <label>
            Unit (e.g. pages, reps, km)
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1"
            />
          </label>
        )}

        <label>
          Reward currency
          <select
            value={currencyMode}
            onChange={(e) => setCurrencyMode(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1"
          >
            {existingCurrencies.map((c) => (
              <option key={c} value={c}>
                {currencyInfo[c]?.icon || '🪙'} {currencyInfo[c]?.label || c}
              </option>
            ))}
            <option value="__new__">+ New currency...</option>
          </select>
        </label>

        {currencyMode === '__new__' && (
          <label>
            New currency name
            <input
              value={newCurrencyName}
              onChange={(e) => setNewCurrencyName(e.target.value)}
              placeholder="e.g. crystals"
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1"
            />
          </label>
        )}

        <label>
          Reward amount <span className="text-gray-500">(max {CUSTOM_REWARD_MAX})</span>
          <input
            type="number"
            min="1"
            max={CUSTOM_REWARD_MAX}
            value={amount}
            onChange={handleAmountChange}
            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1"
          />
        </label>

        <p className="text-xs text-gray-500">
          Custom missions can earn at most {CUSTOM_DAILY_CAP} total per day.
        </p>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSubmit}
          className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-bold text-sm"
        >
          Add Mission
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-bold text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default AddMissionForm