// Turns a plural unit into a singular one for button labels ("pages" -> "page").
// Handles the common English patterns; anything else is left as typed.
export function singularize(word) {
  const w = (word || '').trim()
  const lower = w.toLowerCase()

  if (lower.length <= 2) return w                       // "km", "kg"
  if (lower.endsWith('ies')) return w.slice(0, -3) + 'y' // "reps of studies" -> "study"
  if (/(sses|shes|ches|xes|zes)$/.test(lower)) return w.slice(0, -2) // "glasses" -> "glass"
  if (lower.endsWith('ss') || lower.endsWith('us')) return w // "class", "bus"
  if (lower.endsWith('s')) return w.slice(0, -1)         // "pages" -> "page"

  return w
}