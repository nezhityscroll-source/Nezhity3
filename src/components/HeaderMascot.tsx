import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gem, Heart, Trophy, CheckCircle2, X } from 'lucide-react';
import { MascotReactionEvent } from '../types';

interface HeaderMascotProps {
  userAvatar: string;
  isDarkTheme: boolean;
  reaction: MascotReactionEvent | null;
  onOpenProfile: () => void;
  onClearReaction?: () => void;
}

const PLAYFUL_QUOTES = [
  'Красота без компромиссов! 🦇💅',
  'Нежить одобряет твой стиль! ✨🖤',
  'Ангелина уже готовит пилочки! 💖',
  'Ты сияешь ярче всех страз! 💎',
  'Хаос под контролем, ногти в огне! 🔥',
];

// Lightweight web audio chime synthesizer
function playCelebrationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
    });
  } catch {
    // Audio may be blocked or unsupported; silent fallback
  }
}

export const HeaderMascot: React.FC<HeaderMascotProps> = ({
  userAvatar,
  isDarkTheme,
  reaction,
  onOpenProfile,
  onClearReaction,
}) => {
  const [isReacting, setIsReacting] = useState(false);
  const [activeSpeech, setActiveSpeech] = useState<{
    title: string;
    text: string;
    badge?: string;
  } | null>(null);
  const [clickCount, setClickCount] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger celebration animation when a reaction event arrives
  useEffect(() => {
    if (!reaction) return;

    setIsReacting(true);
    playCelebrationChime();

    let title = 'Нежить в восторге!';
    let badge = reaction.amount ? `+${reaction.amount} 💎` : '✓ Выполнено';

    if (reaction.type === 'points') {
      title = 'Новые баллы!';
    } else if (reaction.type === 'quest') {
      title = 'Задание выполнено!';
      badge = reaction.amount ? `+${reaction.amount} 💎` : 'Награда в копилке';
    } else if (reaction.type === 'streak') {
      title = 'Стрик ухода!';
      badge = '+50 💎';
    }

    setActiveSpeech({
      title,
      text: reaction.label,
      badge,
    });

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsReacting(false);
      setActiveSpeech(null);
      if (onClearReaction) onClearReaction();
    }, 4200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [reaction, onClearReaction]);

  // Click mascot directly to interact
  const handleMascotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReacting(true);
    playCelebrationChime();

    const quote = PLAYFUL_QUOTES[clickCount % PLAYFUL_QUOTES.length];
    setClickCount((c) => c + 1);

    setActiveSpeech({
      title: 'Нежить шепчет:',
      text: quote,
      badge: 'ART XAOC ✦',
    });

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsReacting(false);
      setActiveSpeech(null);
    }, 3500);
  };

  return (
    <div className="relative flex items-center select-none" id="header-mascot-container">
      {/* Floating points indicator when gaining rewards */}
      <AnimatePresence>
        {isReacting && reaction && (
          <motion.div
            key={reaction.id}
            initial={{ opacity: 0, y: 0, scale: 0.5, x: 10 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -36,
              scale: [0.5, 1.25, 1.1, 0.9],
              x: 14,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="absolute -top-1 left-2 pointer-events-none z-50 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-900 text-white font-mono text-xs font-bold shadow-lg border border-white/20 whitespace-nowrap"
          >
            <Sparkles className="w-3 h-3 text-amber-200 animate-spin" />
            <span>{reaction.amount ? `+${reaction.amount}` : 'УСПЕХ!'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Avatar Button with Spring Reaction Animation */}
      <motion.button
        type="button"
        id="btn-header-mascot-avatar"
        onClick={handleMascotClick}
        title="Нежить (маскот студии) — нажми для реакции!"
        className="relative group cursor-pointer rounded-full focus:outline-hidden"
        animate={
          isReacting
            ? {
                scale: [1, 1.28, 0.92, 1.15, 1],
                rotate: [0, -10, 10, -5, 4, 0],
                y: [0, -6, 2, -3, 0],
              }
            : {
                y: [0, -1.5, 0],
              }
        }
        transition={
          isReacting
            ? { duration: 0.75, ease: 'easeInOut' }
            : { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
        }
      >
        {/* Pulsing Aura on Celebration */}
        <AnimatePresence>
          {isReacting && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0.9 }}
              animate={{ scale: [0.8, 1.6, 2.1], opacity: [0.9, 0.4, 0] }}
              exit={{ opacity: 0 }}
              transition={{ repeat: 2, duration: 1, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-stone-400/30 blur-xs pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Orbiting Sparkles during reaction */}
        {isReacting && (
          <div className="absolute -inset-1.5 pointer-events-none">
            <span className="absolute -top-1 -right-1 text-[10px] animate-bounce">✨</span>
            <span className="absolute -bottom-1 -left-1 text-[10px] animate-ping">🤍</span>
            <span className="absolute top-0 -left-1.5 text-[9px] animate-pulse">🦇</span>
          </div>
        )}

        {/* Avatar Image Frame */}
        <div
          className={`w-10 h-10 rounded-full overflow-hidden transition-all duration-300 relative bg-stone-900 ${
            isReacting
              ? 'ring-2 ring-white/60 shadow-lg scale-105'
              : 'ring-1 ring-white/20 shadow-sm group-hover:ring-white/40 group-hover:scale-105'
          }`}
        >
          <img
            src={
              isReacting
                ? '/assets/nezhity-new-look.jpg'
                : userAvatar || '/assets/nezhity-new-look.jpg'
            }
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('nezhity-new-look.jpg')) {
                target.src = '/assets/nezhity-new-look.jpg';
              }
            }}
            alt="Нежить"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top transition-transform duration-200"
          />
        </div>

        {/* Online / Mascot Status Dot */}
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
            isDarkTheme ? 'border-stone-950' : 'border-white'
          } ${isReacting ? 'bg-rose-400 animate-ping' : 'bg-emerald-500'}`}
        />
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
            isDarkTheme ? 'border-stone-950' : 'border-white'
          } ${isReacting ? 'bg-rose-400' : 'bg-emerald-500'}`}
        />
      </motion.button>

      {/* Mascot Speech Bubble Popover (Appears during reaction or click) */}
      <AnimatePresence>
        {activeSpeech && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9, transformOrigin: 'top left' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`absolute left-0 top-12 z-50 w-64 p-3 rounded-2xl border shadow-2xl backdrop-blur-xl ${
              isDarkTheme
                ? 'bg-stone-900/95 border-white/10 text-stone-100 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
                : 'bg-white/95 border-stone-200 text-stone-800 shadow-[0_10px_25px_rgba(0,0,0,0.08)]'
            }`}
          >
            {/* Top Pointer Triangle */}
            <div
              className={`absolute -top-1.5 left-4 w-3 h-3 rotate-45 border-t border-l ${
                isDarkTheme
                  ? 'bg-stone-900 border-white/10'
                  : 'bg-white border-stone-200'
              }`}
            />

            <div className="flex items-start justify-between gap-1 mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🦇</span>
                <span className={`text-[11px] font-bold uppercase tracking-wider font-mono ${
                  isDarkTheme ? 'text-stone-300' : 'text-stone-700'
                }`}>
                  {activeSpeech.title}
                </span>
              </div>
              {activeSpeech.badge && (
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold font-mono ${
                  isDarkTheme ? 'bg-white/10 text-stone-300 border border-white/10' : 'bg-stone-100 text-stone-700 border border-stone-200'
                }`}>
                  {activeSpeech.badge}
                </span>
              )}
            </div>

            <p className="text-xs font-medium leading-relaxed pr-2">
              {activeSpeech.text}
            </p>

            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
              <span className="text-stone-400 italic">Нажми на профиль</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProfile();
                  setActiveSpeech(null);
                }}
                className={`font-bold underline cursor-pointer ${
                  isDarkTheme ? 'text-stone-300 hover:text-white' : 'text-stone-800 hover:text-black'
                }`}
              >
                Открыть профиль →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
