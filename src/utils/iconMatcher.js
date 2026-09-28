// Maps common activity keywords to an emoji icon.
// Checked in order — first match wins, so more specific words should come first.
const iconRules = [
  { keywords: ['water', 'drink', 'hydrate'], icon: '💧' },
  { keywords: ['sleep', 'nap', 'rest'], icon: '😴' },
  { keywords: ['meditat', 'mindful', 'breathe'], icon: '🧘' },
  { keywords: ['yoga'], icon: '🧘‍♀️' },
  { keywords: ['run', 'jog'], icon: '🏃' },
  { keywords: ['walk', 'steps'], icon: '🚶' },
  { keywords: ['gym', 'workout', 'exercise', 'lift', 'weights'], icon: '💪' },
  { keywords: ['cycle', 'bike', 'cycling'], icon: '🚴' },
  { keywords: ['swim'], icon: '🏊' },
  { keywords: ['read', 'book'], icon: '📖' },
  { keywords: ['study', 'homework', 'exam', 'revise'], icon: '📚' },
  { keywords: ['write', 'journal', 'diary'], icon: '✍️' },
  { keywords: ['code', 'program', 'coding', 'dev'], icon: '💻' },
  { keywords: ['draw', 'paint', 'sketch', 'art'], icon: '🎨' },
  { keywords: ['music', 'guitar', 'piano', 'sing', 'practice instrument'], icon: '🎵' },
  { keywords: ['cook', 'meal', 'kitchen'], icon: '🍳' },
  { keywords: ['clean', 'tidy', 'chores'], icon: '🧹' },
  { keywords: ['gratitude', 'thankful'], icon: '🙏' },
  { keywords: ['stretch'], icon: '🤸' },
  { keywords: ['sun', 'sunlight', 'outside', 'outdoor'], icon: '☀️' },
  { keywords: ['screen', 'phone', 'digital detox'], icon: '📵' },
]

// Given a mission name typed by the user, returns the best-matching icon,
// or a default target icon if nothing matches.
export function getIconForActivity(name) {
  const lowerName = name.toLowerCase()

  for (const rule of iconRules) {
    const matched = rule.keywords.some((keyword) => lowerName.includes(keyword))
    if (matched) return rule.icon
  }

  return '🎯' // default fallback
}