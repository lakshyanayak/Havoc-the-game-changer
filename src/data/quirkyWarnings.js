export const quirkyWarnings = [
  "Don't scam yourself.",
  "Don't be the villain in your own story.",
  "Don't finesse yourself out of your own potential.",
  "Don't let your excuses gaslight your ambitions.",
  "Don't cheat the person you're becoming.",
  "Don't rob Future You to pay Present You.",
  "Don't negotiate against yourself.",
  "Don't short-change your own potential.",
  "Don't betray the version of you that's counting on you.",
  "Don't let lazy-you sabotage legendary-you.",
  "Keep your promises to yourself — Future You is taking notes.",
  "Don't lose to yourself before the game even starts.",
  "Be loyal to your own goals.",
  "Don't ghost the person you promised you'd become.",
  "No self-sabotage. We're too invested in the character arc.",
]

// Returns one random line from the list
export function getRandomQuirkyWarning() {
  const index = Math.floor(Math.random() * quirkyWarnings.length)
  return quirkyWarnings[index]
}