import { useRef } from 'react'
import { motion } from 'framer-motion'
import Companion from '../components/Companion'
import { useGameStore } from '../store/gameStore'

function CompanionScreen() {
  const wellbeing = useGameStore((state) => state.getWellbeing())
  const companionName = useGameStore((state) => state.companionName || 'Companion')
  const areaRef = useRef(null)
  const wasDragged = useRef(false)

  return (
    <div className="pointer-events-none fixed inset-0 z-30" aria-label={`${companionName} overlay`}>
      <div ref={areaRef} className="absolute inset-x-4 top-4 bottom-24" />

      <motion.div
        drag
        dragConstraints={areaRef}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => { wasDragged.current = true }}
        onDragEnd={() => { setTimeout(() => { wasDragged.current = false }, 50) }}
        onClickCapture={(event) => { if (wasDragged.current) event.stopPropagation() }}
        className="pointer-events-auto absolute bottom-[calc(6rem+18%)] left-[calc(50%-70px)] z-10 h-40 w-[140px] cursor-grab active:cursor-grabbing"
        aria-label={`Drag and pet ${companionName}`}
      >
        <div className="absolute -bottom-1 left-1/2 h-4 w-[110px] -translate-x-1/2 rounded-[50%] bg-black/45 blur-sm" />
        <Companion score={wellbeing} />
      </motion.div>
    </div>
  )
}

export default CompanionScreen