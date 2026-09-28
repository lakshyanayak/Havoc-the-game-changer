import tidy from '../assets/shelter/tidy.webp'
import livedIn from '../assets/shelter/lived_in.webp'
import worn from '../assets/shelter/worn.webp'
import neglected from '../assets/shelter/neglected.webp'
import desolate from '../assets/shelter/desolate.webp'

// One shelter picture per mood. The mood names come from getMoodFromWellbeing()
// in the store, so the cut-offs live in exactly one place.
export const SHELTER_BY_MOOD = {
  Thriving: { image: tidy, label: 'Tidy' },
  Content: { image: livedIn, label: 'Lived-in' },
  Neutral: { image: worn, label: 'Worn' },
  Low: { image: neglected, label: 'Neglected' },
  Critical: { image: desolate, label: 'Desolate' },
}