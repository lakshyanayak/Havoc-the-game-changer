import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Companion from '../components/Companion'
import { useGameStore, getMoodFromWellbeing } from '../store/gameStore'
import { SHELTER_BY_MOOD } from '../utils/shelterMood'
function CompanionScreen() {
  const wellbeing = useGameStore((state) => state.getWellbeing())
  const mood = getMoodFromWellbeing(wellbeing)
  const shelter = SHELTER_BY_MOOD[mood]
  const areaRef = useRef(null)
  const [theme, setTheme] = useState('normal')
  const wasDragged = useRef(false)
  const lastPos = useRef(null)
  const lastTime = useRef(null)
  const companionRef = useRef(null)

  function handleDrag(e, info) {
    const now = Date.now()
    if (lastPos.current && lastTime.current) {
      const dt = now - lastTime.current
      const dist = Math.hypot(info.point.x - lastPos.current.x, info.point.y - lastPos.current.y)
      const speed = dist / dt
      if (speed > 1.2 && companionRef.current) {
        companionRef.current.setDizzy()
      }
    }
    lastPos.current = info.point
    lastTime.current = now
  }

  return (
    <div
      className="relative mx-auto min-h-[100dvh] w-full max-w-md overflow-hidden bg-cover bg-center text-white shadow-2xl"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.48), rgba(0,0,0,.18) 45%, rgba(0,0,0,.72)), url(${shelter.image})`,
      }}
    >
      <div className="absolute inset-x-5 top-5 flex items-baseline justify-end">
        <span className="text-sm font-semibold text-cyan-200">{mood} · {wellbeing}%
        </span>
      </div>

      <div ref={areaRef} className="absolute inset-x-5 top-28 bottom-24 pointer-events-none" />

      <motion.div
        drag
        dragConstraints={areaRef}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => { wasDragged.current = true }}
        onDrag={handleDrag}
        onDragEnd={() => { setTimeout(() => { wasDragged.current = false }, 50) }}
        onClickCapture={(event) => { if (wasDragged.current) event.stopPropagation() }}
        className="absolute bottom-[24%] left-[calc(50%-70px)] z-10 h-40 w-[140px] cursor-grab active:cursor-grabbing"
        aria-label="Drag and pet your companion"
      >
        <div className="absolute -bottom-1 left-1/2 h-4 w-[110px] -translate-x-1/2 rounded-[50%] bg-black/45 blur-sm" />
        <Companion key={mood} ref={companionRef} score={wellbeing} theme={theme} />
      </motion.div>
      <div className="absolute top-14 right-5 z-30">
        <div className="relative flex items-center rounded-full border border-cyan-300/30 bg-slate-950/60 px-3 py-2 shadow-lg backdrop-blur-md">
        <span className="mr-2 text-xs text-cyan-200">
          Theme
        </span>
        <select
        id="theme"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="max-w-[115px] appearance-none bg-transparent pr-5 text-sm font-medium text-white outline-none"
        >
          <option className="bg-slate-900 text-white" value="normal">Normal</option>
          <option className="bg-slate-900 text-white" value="neonCity">Neon City</option>
          <option className="bg-slate-900 text-white" value="wasteland">Wasteland</option>
          <option className="bg-slate-900 text-white" value="bioHaven">Bio Haven</option>
          <option className="bg-slate-900 text-white" value="holographic">Holographic</option>
          </select>
          <span className="pointer-events-none absolute right-3 text-cyan-300 text-xs">
            ▾
          </span>
        </div>
      </div>
    </div>
  )
}

export default CompanionScreen;
