import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getMoodFromWellbeing, useGameStore } from '../store/gameStore';
const earAngles = {
  thriving: 8,
  content: 28,
  neutral: 28,
  low: 28,
  critical: 110,
};

const legAngles = {
  thriving: 15,
  content: 15,
  neutral: 15,
  low: 0,
  critical: 0,
};

const messages = {
  thriving: {
    'Morning.': ["Great start to the day!", "Woke up and chose vibes.", "Today's gonna be a good one!", "10/10, no bugs detected.", "Main character energy today."],
    'Afternoon.': ["Feeling amazing right now!", "Peak performance unlocked.", "Who's this glowing? Oh, it's me.", "Running smoother than fresh code.", "Certified good vibes only."],
    'Evening.': ["What a good day this has been!", "Ending strong, no notes.", "Living my best robot life.", "Can't stop, won't stop.", "Today deserves a gold star."],
    'Night.': ["Still going strong tonight!", "Thriving even at this hour, impressive.", "Sleep? Never heard of her.", "Night owl mode: thriving edition.", "Who needs rest when you're this happy."],
  },
  content: {
    'Morning.': ["Good morning, ready for today.", "Coffee not included but vibes are.", "Decent start, I'll take it.", "Feeling okay, no complaints.", "Steady morning, steady me."],
    'Afternoon.': ["Doing pretty well today.", "Steady as she goes.", "Content and mildly caffeinated.", "Cruising through the day just fine.", "Nothing fancy, just content."],
    'Evening.': ["Winding down nicely.", "Comfy and unbothered.", "Evening mode: activated.", "Content, calm, and cozy.", "A solid, unremarkable good day."],
    'Night.': ["A calm night.", "Just vibing under the stars.", "Peaceful. Suspiciously peaceful.", "Settling in for the night, content.", "Quiet mind, quiet night."],
  },
  neutral: {
    'Morning.': ["Another day begins.", "Neutral but present.", "Existing, as one does.", "Not bad, not great, just here.", "Morning has arrived, apparently."],
    'Afternoon.': ["Just an ordinary afternoon.", "Nothing to report, captain.", "Mid-day, mid-mood.", "Floating through the afternoon.", "Perfectly average, thank you."],
    'Evening.': ["Evening's here.", "Coasting along.", "Neither here nor there, honestly.", "Just another evening, really.", "Status: fine, I guess."],
    'Night.': ["Quiet night so far.", "Just watching the clock tick.", "Neutral energy, all day energy.", "Nothing much happening tonight.", "Just existing under the moonlight."],
  },
  low: {
    'Morning.': ["Feeling a bit tired this morning.", "Running on empty already.", "Snooze button called, I answered.", "Woke up already tired, cool cool.", "Morning is doing too much right now."],
    'Afternoon.': ["Running low on energy.", "Could use a nap, honestly.", "Batteries at 20%, be gentle.", "Everything feels heavier today.", "Please speak softly, low on juice."],
    'Evening.': ["Could use some rest tonight.", "Fading fast over here.", "Low power mode kicking in.", "Today really took it out of me.", "Running on backup power only."],
    'Night.': ["Getting sleepy.", "Eyes are getting heavy...", "Is it bedtime yet?", "Struggling to stay awake here.", "Please carry me to bed."],
  },
  critical: {
    'Morning.': ["Not feeling great today.", "Rough start, need backup.", "Struggling to boot up today.", "Today already feels like a lot.", "Send coffee. Or a hug. Both work."],
    'Afternoon.': ["Really need some care.", "Running on fumes here.", "Send help. Or water. Or sleep.", "This is not a drill, I need rest.", "Everything hurts, metaphorically."],
    'Evening.': ["It's been a tough day.", "Barely holding it together.", "This day really did a number on me.", "I've had better days, honestly.", "Running dangerously low on everything."],
    'Night.': ["Please take care of me soon.", "Critical levels, please advise.", "I need a serious reset.", "Tonight was rough. Tomorrow, please be kind.", "Emergency nap required."],
  },
};

function getTimeofDay()
{
  const hour = new Date().getHours();
  if(hour >= 5 && hour < 12) return 'Morning.';
  if(hour >= 12 && hour < 17) return 'Afternoon.';
  if(hour >= 17 && hour < 21) return 'Evening.';
  return 'Night.';

}

function Eyes({ mood }) {
  if (mood === 'thriving') {
    return (
      <svg width="80" height="40" viewBox="0 0 90 50">
        <ellipse cx="20" cy="22" rx="16" ry="22" fill="#222" />
        <ellipse cx="60" cy="22" rx="16" ry="22" fill="#222" />
        <circle cx="24" cy="18" r="7" fill="#fff" />
        <circle cx="9" cy="26" r="3" fill="#fff" />
        <circle cx="18" cy="34" r="3.5" fill="#fff" />
        <circle cx="55" cy="18" r="7" fill="#fff" />
        <circle cx="70" cy="26" r="3" fill="#fff" />
        <circle cx="60" cy="34" r="3.5" fill="#fff" />
      </svg>
    );
  }
  if (mood === 'content') {
    return (
      <svg width="88" height="40" viewBox="0 0 98 50">
        <path d="M8,25 L20,18 L32,25" stroke="#222" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8,25 L20,18 L32,25" stroke="#222" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(48, 0)" />
      </svg>
    );
  }
  if (mood === 'neutral') {
    return (
      <svg width="80" height="40" viewBox="0 0 90 50">
        <ellipse cx="18" cy="20" rx="12" ry="18" fill="#222" />
        <ellipse cx="60" cy="20" rx="12" ry="18" fill="#222" />
      </svg>
    );
  }
  if (mood === 'low') {
    return (
      <svg width="80" height="40" viewBox="0 0 90 50">
        <line x1="2" y1="35" x2="27" y2="25" stroke="#222" strokeWidth="5" strokeLinecap="round" />
        <line x1="82" y1="35" x2="57" y2="25" stroke="#222" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="98" height="50" viewBox="0 0 98 50">
      <path d="M8,16 L36,16 A14,16 0 0 1 8,16 Z" stroke="#222" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      <path d="M10,30 Q22,40 34,28" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <g transform="translate(90, 0) scale(-1, 1)">
        <path d="M8,16 L36,16 A14,16 0 0 1 8,16 Z" stroke="#222" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
        <path d="M10,30 Q22,40 34,28" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Companion({ score }) {
  const playerName = useGameStore((state) => state.playerName);
  const loginCount = useGameStore((state) => state.loginCount) || 0;
  const mood = getMoodFromWellbeing(score).toLowerCase();
  const earAngle = earAngles[mood];
  const legAngle = legAngles[mood];
  const timeOfDay = getTimeofDay();
  const options = messages[mood][timeOfDay];
  const message = options[Math.floor(score) % options.length];

  const bodyControls = useAnimation();
  const leftEarControls = useAnimation();
  const rightEarControls = useAnimation();
  const legControls = useAnimation();

  useEffect(() => {
    leftEarControls.start({ rotate: -earAngle, transition: { duration: 0.5 } });
    rightEarControls.start({ rotate: earAngle, transition: { duration: 0.5 } });
  }, [earAngle, leftEarControls, rightEarControls]);

  const [showMessage, setShowMessage] = useState(true);
  const greetingLoginKey = 'havoc-companion-greeting-login-count';
  const loginGreeting = loginCount > 0 && Number(localStorage.getItem(greetingLoginKey)) !== loginCount;
  useEffect(() => {
    if (loginGreeting) localStorage.setItem(greetingLoginKey, String(loginCount));
    const timer = setTimeout(() => setShowMessage(false), 4000);
    return () => clearTimeout(timer);
  }, [loginGreeting, loginCount]);
  const displayedMessage = loginGreeting
    ? `Welcome back, ${playerName?.trim() || 'player'}. Systems stable.`
    : message;

  function handleTouch(zone) {
    if (mood === 'low' || mood === 'critical') {
      return;
    }
    if (zone === 'face') {
      bodyControls.start({ scale: [1, 1.05, 1], transition: { duration: 0.4 } });
    }
    if (zone === 'head') {
      leftEarControls.start({
        rotate: [-earAngle, -earAngle - 15, -earAngle + 15, -earAngle],
        transition: { duration: 0.4 }
      }).then(() => leftEarControls.start({ rotate: -earAngle }));

      rightEarControls.start({
        rotate: [earAngle, earAngle + 15, earAngle - 15, earAngle],
        transition: { duration: 0.4 }
      }).then(() => rightEarControls.start({ rotate: earAngle }));
    }
    if (zone === 'chin') {
      legControls.start({ y: [0, 6, 0], transition: { duration: 0.3 } });
    }
  }

  return (
    <div style={{ position: 'relative', width: 140, height: 160 }}>
      <motion.div animate={legControls} style={{ position: 'absolute', top: 120, left: 20 }}>
        <motion.div animate={{ rotate: -legAngle }} transition={{ duration: 0.5 }}
          style={{ width: 14, height: 30, background: '#ccc', border: '2px solid #222', borderRadius: '50% / 60%', transformOrigin: 'top center' }}
          onClick={() => handleTouch('chin')} />
      </motion.div>
      <motion.div animate={legControls} style={{ position: 'absolute', top: 120, left: 90 }}>
        <motion.div animate={{ rotate: legAngle }} transition={{ duration: 0.5 }}
          style={{ width: 14, height: 30, background: '#ccc', border: '2px solid #222', borderRadius: '50% / 60%', transformOrigin: 'top center' }}
          onClick={() => handleTouch('chin')} />
      </motion.div>
      <motion.div animate={legControls} style={{ position: 'absolute', top: 110, left: 113 }}>
        <motion.div animate={{ rotate: legAngle }} transition={{ duration: 0.5 }}
          style={{ width: 14, height: 30, background: '#ccc', border: '2px solid #222', borderRadius: '50% / 60%', transformOrigin: 'top center' }}
          onClick={() => handleTouch('chin')} />
      </motion.div>
      <motion.div animate={legControls} style={{ position: 'absolute', top: 110, left: 40 }}>
        <motion.div animate={{ rotate: -legAngle }} transition={{ duration: 0.5 }}
          style={{ width: 14, height: 30, background: '#ccc', border: '2px solid #222', borderRadius: '50% / 60%', transformOrigin: 'top center' }}
          onClick={() => handleTouch('chin')} />
      </motion.div>
      <motion.div animate={bodyControls}
        style={{ position: 'absolute', top: 40, left: 5, width: 130, height: 90, background: '#ccc', border: '2px solid #222', borderRadius: '38px / 30px' }}
        onClick={() => handleTouch('face')}>
        <div style={{
          position: 'absolute',
          top: 20, left: 5, right: 20, bottom: 5, 
          border: '2px solid #000',
          borderRadius: '28px / 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          pointerEvents: 'none'
        }}>
          <Eyes mood={mood} />
          </div>
          </motion.div>
      <motion.div animate={leftEarControls}
        style={{ position: 'absolute', top: -30, left: 20, width: 38, height: 82, transformOrigin: 'bottom center' }}
        onClick={() => handleTouch('head')}>
        <svg width="40" height="82" viewBox="0 0 40 82">
          <path d="M20,82 C4,60 4,20 20,2 C36,20 36,60 20,82 Z" fill="#ccc" stroke="#222" strokeWidth="2" />
          <rect x="15" y="78" width="10" height="5" rx="4" fill="#222"/>
        </svg>
      </motion.div>
      <motion.div animate={rightEarControls}
        style={{ position: 'absolute', top: -30, left: 60, width: 38, height: 82, transformOrigin: 'bottom center' }}
        onClick={() => handleTouch('head')}>        
        <svg width="40" height="82" viewBox="0 0 40 82">
          <path d="M20,82 C4,60 4,20 20,2 C36,20 36,60 20,82 Z" fill="#ccc" stroke="#222" strokeWidth="2" />
          <rect x="15" y="78" width="10" height="5" rx="4" fill="#222"/>
        </svg>
      </motion.div>
      {showMessage && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 34px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'max-content',
          maxWidth: 180,
          background: '#fff',
          color: '#222',
          border: '2px solid #222',
          borderRadius: 12,
          padding: '8px 14px',
          fontSize: 13,
          whiteSpace: 'nowrap',
          minWidth: 'max-content',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          pointerEvents: 'none',
          zIndex: 20
        }}>
          {displayedMessage}
        </div>
      )}
    </div>
  );
}

export default Companion;