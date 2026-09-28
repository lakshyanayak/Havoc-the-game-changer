import { useRef } from 'react'
import { motion } from 'framer-motion'
import Companion from '../components/Companion'
import { useGameStore, getMoodFromWellbeing } from '../store/gameStore'
import { SHELTER_BY_MOOD } from '../utils/shelterMood'

function CompanionScreen() {
  const wellbeing = useGameStore((state) => state.getWellbeing())
  const mood = getMoodFromWellbeing(wellbeing)
  const shelter = SHELTER_BY_MOOD[mood]
  const areaRef = useRef(null)
  const wasDragged = useRef(false)

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center text-white"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.48), rgba(0,0,0,.18) 45%, rgba(0,0,0,.72)), url(${shelter.image})`,
      }}
    >
      <div className="absolute inset-x-5 top-5 flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-widest text-gray-200">Companion</span>
        <span className="text-sm font-semibold text-cyan-200">{mood} · {wellbeing}%</span>
      </div>

      <div ref={areaRef} className="absolute inset-x-5 top-28 bottom-24 pointer-events-none" />

      <motion.div
        drag
        dragConstraints={areaRef}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => { wasDragged.current = true }}
        onDragEnd={() => { setTimeout(() => { wasDragged.current = false }, 50) }}
        onClickCapture={(event) => { if (wasDragged.current) event.stopPropagation() }}
        className="absolute bottom-[24%] left-[calc(50%-70px)] z-10 h-40 w-[140px] cursor-grab active:cursor-grabbing"
        aria-label="Drag and pet your companion"
      >
        <div className="absolute -bottom-1 left-1/2 h-4 w-[110px] -translate-x-1/2 rounded-[50%] bg-black/45 blur-sm" />
        <Companion key={mood} score={wellbeing} />
      </motion.div>
    </div>
  )
}

export default CompanionScreen