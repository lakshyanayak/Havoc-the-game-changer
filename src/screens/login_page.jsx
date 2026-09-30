import { useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const setPlayerName = useGameStore((state) => state.setPlayerName);
  const logout = useGameStore((state) => state.logout);

  function handleStart() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPlayerName(trimmed);
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#0B0E1A] text-[#D7E3F2] px-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold tracking-wide"
      >
        IDENTIFY YOURSELF, OPERATIVE
      </motion.h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleStart()}
        placeholder="Enter your name"
        maxLength={20}
        className="w-full max-w-xs rounded-lg bg-[#1B2340] border border-[#8B5CF6] px-4 py-3 text-center outline-none"
        autoFocus
      />

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={handleStart}
        disabled={!name.trim()}
        className="w-full max-w-xs rounded-lg bg-[#8B5CF6] disabled:opacity-40 px-4 py-3 font-semibold"
      >
        Enter Shelter
      </motion.button>
    </div>
  );
}