import { useRef, useState } from 'react'

const VIDEO_SRC = '/intro-landscape.mp4'

function IntroScreen({ onFinish }) {
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef(null)

  function toggleMute() {
    const nextMuted = !isMuted
    setIsMuted(nextMuted)

    const video = videoRef.current
    if (!video) return

    video.muted = nextMuted
    if (!nextMuted) video.play().catch(() => {})
  }

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay
        muted={isMuted}
        playsInline
        onEnded={onFinish}
        className="w-full h-full object-contain"
      />
      <div className="absolute top-5 right-5 z-10 flex gap-2">
        <button
          onClick={toggleMute}
          aria-pressed={!isMuted}
          className="text-white/80 text-sm border border-white/30 rounded-full px-3 py-1 hover:bg-white/10"
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        <button
          onClick={onFinish}
          className="text-white/70 text-sm border border-white/30 rounded-full px-3 py-1 hover:bg-white/10"
        >
          Skip
        </button>
      </div>
    </div>
  )
}

export default IntroScreen