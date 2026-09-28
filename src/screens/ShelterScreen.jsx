import { motion } from 'framer-motion'
import { useGameStore, getMoodFromWellbeing } from '../store/gameStore'
import { SHELTER_BY_MOOD } from '../utils/shelterMood'

function ShelterScreen() {
  const wellbeing = useGameStore((state) => state.getWellbeing())
  const mood = getMoodFromWellbeing(wellbeing)
  const shelter = SHELTER_BY_MOOD[mood]

  return (
    <div className="relative h-[calc(100svh-4rem)] min-h-[320px] overflow-hidden bg-[#05070b]">
      <motion.img
        key={mood}
        src={shelter.image}
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.38 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
      />

      <motion.img
        key={`${mood}-full`}
        src={shelter.image}
        alt={`${shelter.label} shelter`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 h-full w-full object-contain"
      />

      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/75 to-transparent" />

      <div className="absolute inset-x-5 top-5 z-10 flex items-baseline justify-between gap-3">
        <span className="text-xs uppercase tracking-widest text-gray-300">Your Shelter</span>
        <span className="text-right text-sm font-semibold text-cyan-300">
          {shelter.label} · {mood} {wellbeing}%
        </span>
      </div>
    </div>
  )
}

export default ShelterScreen