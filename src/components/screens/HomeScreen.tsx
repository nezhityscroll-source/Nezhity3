import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Calendar,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Wand2,
  BookOpen,
  ExternalLink,
  Flame,
  Terminal,
  Heart,
  Dices,
  RefreshCw,
  Droplets,
  Crown,
  ShieldCheck,
  Clock,
  Gem,
  ArrowUpRight,
  Activity,
  Check,
  Ticket,
  Palette,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TabType, GallerySet, ActiveBooking } from '../../types';
import { GALLERY_SETS } from '../../data/servicesData';

interface HomeScreenProps {
  isDarkTheme: boolean;
  onNavigate: (tab: TabType) => void;
  onOpenAiBuilder: () => void;
  onSelectSetToBook: (set: GallerySet) => void;
  cuticleApplied: boolean;
  onToggleCuticleCare: () => void;
  careDays: number;
  tickets?: number;
  onConsoleButtonClick?: () => void;
  activeBooking?: ActiveBooking | null;
  onOpenBookingDetails?: () => void;
  userAvatar?: string;
  onSelectMascotLook?: (image: string) => void;
}

interface MascotMood {
  id: string;
  name: string;
  badge: string;
  image: string;
  speech: string;
}

const MASCOT_LOOKS: MascotMood[] = [
  {
    id: 'hello',
    name: 'На связи',
    badge: 'Нежить на связи ♡',
    image: '/assets/art-haos-nezhity-transparent-hello.png',
    speech: 'Нежить всегда на связи — подскажет, вдохновит и поможет выбрать всё, что тебе нужно.',
  },
  {
    id: 'couture',
    name: 'Couture',
    badge: 'Новый стиль ✨',
    image: '/assets/nezhity-new-look.jpg',
    speech: '«Смотри, какой дерзкий образ! Черный хром, капли жидкого металла и нежная жесть ♡»',
  },
  {
    id: 'joy',
    name: 'Радость',
    badge: 'Сияние & Драйв 💖',
    image: '/assets/art-haos-nezhity-transparent-joy-face-fixed.png',
    speech: '«Сегодня идеальный день для безупречного маникюра! Ангелина уже ждёт тебя ♡»',
  },
  {
    id: 'book',
    name: 'Мудборд',
    badge: 'Тренды сезона 📖',
    image: '/assets/nezhity-price-book.png',
    speech: '«Я собрала для тебя свежие готические и нюдовые дизайны. Какой выберем?»',
  },
  {
    id: 'thinking',
    name: 'AI Анализ',
    badge: 'Вдохновение 🔮',
    image: '/assets/art-haos-nezhity-transparent-thinking.png',
    speech: '«Хм... Под твою длину и форму идеально подойдёт миндаль с матовым финишем!»',
  },
];

const NEZHITY_SPEECHES = [
  '«Смотри, какой дерзкий образ! Черный хром, капли жидкого металла и нежная жесть ♡»',
  '«Сегодня идеальный день для безупречного маникюра! Ангелина уже ждёт тебя ♡»',
  '«Я собрала для тебя свежие готические и нюдовые дизайны. Какой выберем?»',
  '«Хм... Под твою длину и форму идеально подойдёт миндаль с матовым финишем!»',
  '«Привет! Я Нежить. Твои ноготки заслуживают заботы и фирменной магии ART XAOC ♡»',
  '«Красота без компромиссов! Добавим немного дерзости твоему образу ✨»',
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  isDarkTheme,
  onNavigate,
  onOpenAiBuilder,
  onSelectSetToBook,
  cuticleApplied,
  onToggleCuticleCare,
  careDays,
  tickets = 4,
  onConsoleButtonClick,
  activeBooking,
  onOpenBookingDetails,
  userAvatar,
  onSelectMascotLook,
}) => {
  const [consoleFeedback, setConsoleFeedback] = useState(false);
  const [currentLookIndex, setCurrentLookIndex] = useState(0);
  const activeLook = MASCOT_LOOKS[currentLookIndex];

  const [activeMascotQuote, setActiveMascotQuote] = useState(activeLook.speech);
  const [mascotBubbleKey, setMascotBubbleKey] = useState(0);
  const [favorites, setFavorites] = useState<string[]>(['set-1']);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'goth' | 'neon' | 'cyber' | 'minimal'>('all');
  const [selectedRandomSet, setSelectedRandomSet] = useState<GallerySet | null>(null);
  const [isSparklingIdea, setIsSparklingIdea] = useState(false);

  // Play gentle audio chime for interactions
  const playRandomChime = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.07 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.25);
      });
    } catch {
      // ignore
    }
  };

  // Switch Mascot Look (changes appearance, quote, badge, and global avatar)
  const cycleMascotLook = () => {
    const nextIdx = (currentLookIndex + 1) % MASCOT_LOOKS.length;
    setCurrentLookIndex(nextIdx);
    const look = MASCOT_LOOKS[nextIdx];
    setActiveMascotQuote(look.speech);
    setMascotBubbleKey((prev) => prev + 1);
    if (onSelectMascotLook) {
      onSelectMascotLook(look.image);
    }
    playRandomChime();
    try {
      confetti({
        particleCount: 22,
        spread: 45,
        origin: { y: 0.35, x: 0.75 },
        colors: ['#c48b9f', '#e2a8b8', '#ffffff', '#9e6b82'],
      });
    } catch {
      // ignore
    }
  };

  const handleSelectLookDirectly = (idx: number) => {
    setCurrentLookIndex(idx);
    const look = MASCOT_LOOKS[idx];
    setActiveMascotQuote(look.speech);
    setMascotBubbleKey((prev) => prev + 1);
    if (onSelectMascotLook) {
      onSelectMascotLook(look.image);
    }
    playRandomChime();
  };

  // Interactive Button: logs "Кнопка нажата!" into browser console
  const handleConsoleLogAction = () => {
    console.log('Кнопка нажата!');
    if (onConsoleButtonClick) {
      onConsoleButtonClick();
    }
    setConsoleFeedback(true);
    setTimeout(() => {
      setConsoleFeedback(false);
    }, 2800);
  };

  // Interactive Mascot Tap: plays speech + confetti
  const handleMascotTap = () => {
    const randomSpeech =
      NEZHITY_SPEECHES[Math.floor(Math.random() * NEZHITY_SPEECHES.length)];

    setActiveMascotQuote(randomSpeech);
    setMascotBubbleKey((prev) => prev + 1);

    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.35, x: 0.75 },
        colors: ['#f43f5e', '#ec4899', '#ffffff', '#a855f7'],
      });
    } catch {
      // ignore
    }
  };

  // Toggle Favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Random Set Generator Capsule
  const handleGenerateIdea = () => {
    setIsSparklingIdea(true);
    const randomIndex = Math.floor(Math.random() * GALLERY_SETS.length);
    const chosen = GALLERY_SETS[randomIndex];

    playRandomChime();
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#db2777', '#c084fc', '#ffffff'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setSelectedRandomSet(chosen);
      setIsSparklingIdea(false);
      setActiveMascotQuote(`«Как тебе сет «${chosen.title}»? По-моему, просто бомба! ♡»`);
      setMascotBubbleKey((prev) => prev + 1);
    }, 350);
  };

  const filteredSets =
    selectedCategory === 'all'
      ? GALLERY_SETS
      : GALLERY_SETS.filter((s) => s.category === selectedCategory);

  // Approximate wear cycle: 15 days worn, 6 days remaining to reach 21 days recommended cycle
  const wearDaysPassed = 15;
  const recommendedMaxDays = 21;
  const daysUntilCorrection = Math.max(0, recommendedMaxDays - wearDaysPassed);
  const wearPercentage = Math.min(100, Math.round((wearDaysPassed / recommendedMaxDays) * 100));

  return (
    <div id="screen-home" className="flex flex-col gap-5 pb-28 animate-in fade-in duration-300">
      {/* CONSOLE FEEDBACK TOAST */}
      {consoleFeedback && (
        <div
          id="console-toast-banner"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 backdrop-blur-xl text-emerald-200 text-xs shadow-[0_8px_32px_rgba(16,185,129,0.3)] flex items-center justify-between animate-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <strong className="text-white block font-bold">Кнопка нажата!</strong>
              <span className="text-[11px] text-emerald-300">
                Сообщение «Кнопка нажата!» выведено в консоль.
              </span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
            console.log
          </span>
        </div>
      )}

      {/* =========================================================================
          1. HERO CARD: Exact match with the reference image
          ========================================================================= */}
      <div
        id="hero-mascot-card"
        className={`relative overflow-hidden rounded-[34px] p-5 sm:p-6 transition-all duration-300 ${
          isDarkTheme
            ? 'liquid-glass-card-dark'
            : 'bg-gradient-to-br from-[#fff2f7] via-[#f8ebff] to-[#ffeef6] border border-white/90 shadow-[0_12px_36px_rgba(244,93,139,0.09)]'
        }`}
      >
        {/* Subtle ambient lighting */}
        <div className="absolute -right-8 -top-8 w-60 h-60 rounded-full bg-[#fce4ec]/60 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-52 h-52 rounded-full bg-[#f3e8ff]/50 blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10 gap-2">
          {/* Left Column: Greeting Pill, 3-line Headline, Subtext, Ask Nezhity button */}
          <div className="flex-1 pr-1 min-w-0">
            {/* Greeting Pill: «Привет, Ангелина ♡» */}
            <div className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-white/75 backdrop-blur-sm border border-pink-200/60 text-[#eb3e75] font-semibold text-xs shadow-2xs mb-2.5 select-none">
              <span>Привет, Ангелина ♡</span>
            </div>

            {/* Headline: «Давай \n найдём \n твой образ.» */}
            <h1 className="font-serif font-black text-3xl sm:text-4xl leading-[1.08] tracking-tight">
              <span className={isDarkTheme ? 'text-white' : 'text-[#1a102a]'}>Давай</span>
              <br />
              <span className={isDarkTheme ? 'text-white' : 'text-[#1a102a]'}>найдём</span>
              <br />
              <span className="text-[#eb3e75]">твой образ.</span>
            </h1>

            {/* Subtext */}
            <p className={`text-xs leading-relaxed mt-2.5 max-w-[205px] sm:max-w-xs ${
              isDarkTheme ? 'text-stone-300' : 'text-[#7c6f89]'
            }`}>
              Нежить всегда на связи — подскажет, вдохновит и поможет выбрать всё, что тебе нужно.
            </p>

            {/* Ask Nezhity Button */}
            <div className="mt-4">
              <button
                id="hero-btn-ask-nezhity"
                onClick={() => onNavigate('nezhity')}
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ff5e8c] to-[#e83269] text-white font-semibold text-xs sm:text-sm shadow-[0_6px_20px_rgba(232,50,105,0.35)] active:scale-95 transition-all cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-white/90 group-hover:rotate-12 transition-transform" />
                <span>Спросить Нежить</span>
                <ChevronRight className="w-4 h-4 text-white/90 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Mascot Girl with Doodles and Carousel Indicator */}
          <div className="relative flex-shrink-0 flex items-center justify-end select-none">
            {/* Carousel vertical indicator dots: • • • 01/05 */}
            <div
              onClick={cycleMascotLook}
              title="Сменить мысль и образ Нежити"
              className="absolute -right-2 top-0 flex flex-col items-center gap-1 text-[10px] font-mono text-[#9c8ea6] cursor-pointer hover:text-[#eb3e75] transition-colors z-20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#eb3e75]" />
              <span className="w-1.5 h-1.5 rounded-full bg-pink-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-pink-200" />
              <span className="text-[9px] font-bold mt-0.5">0{currentLookIndex + 1}/05</span>
            </div>

            {/* Mascot Container & Doodles */}
            <div
              id="hero-mascot-container"
              onClick={cycleMascotLook}
              className="relative cursor-pointer group flex flex-col items-center"
            >
              {/* Handwritten floating text: «Нежить на связи ♡» */}
              <div className="absolute -top-3 left-0 -translate-x-3 -rotate-6 z-20 pointer-events-none">
                <span className="text-xs font-serif italic font-bold text-[#eb3e75] drop-shadow-xs whitespace-nowrap bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-full border border-pink-200/60 shadow-2xs">
                  Нежить на связи ♡
                </span>
              </div>

              {/* Floating doodles: bat, heart, sparkles */}
              <div className="absolute -top-1 right-5 text-pink-400 text-xs pointer-events-none animate-pulse">
                🦇
              </div>
              <div className="absolute top-1/2 -left-2 text-[#eb3e75] text-xs pointer-events-none">
                ♡
              </div>
              <div className="absolute bottom-3 -left-1 text-pink-400 text-xs pointer-events-none">
                ✦
              </div>

              {/* Mascot Image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeLook.id}
                  id="hero-mascot-avatar-image"
                  src={activeLook.image}
                  alt={`Маскот Нежить - ${activeLook.name}`}
                  referrerPolicy="no-referrer"
                  className="w-36 sm:w-44 h-48 sm:h-54 object-contain object-bottom drop-shadow-[0_8px_20px_rgba(235,62,117,0.16)]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. 2x2 ACTION CARDS: «Подобрать стиль», «Мой уход», «Записаться», «Клуб»
          ========================================================================= */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Подобрать стиль */}
        <button
          id="action-card-style"
          onClick={onOpenAiBuilder}
          type="button"
          className={`group flex flex-col justify-between p-4 rounded-[28px] text-left transition-all duration-200 active:scale-[0.98] relative overflow-hidden ${
            isDarkTheme
              ? 'liquid-glass-card-dark border-white/[0.08] hover:border-white/20'
              : 'bg-white/85 backdrop-blur-md border border-white/90 shadow-[0_4px_20px_rgba(244,93,139,0.08)] hover:shadow-[0_8px_25px_rgba(244,93,139,0.15)]'
          }`}
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-11 h-11 rounded-2xl bg-[#fff0f5] border border-pink-100 flex items-center justify-center text-[#e83269] group-hover:scale-105 transition-transform shadow-2xs">
              <Palette className="w-5 h-5 text-[#e83269]" />
            </div>
            <span className="text-pink-300 text-xs select-none">✦</span>
          </div>

          <div className="mt-4 flex items-end justify-between w-full">
            <div>
              <h3 className={`font-bold text-sm sm:text-base leading-tight font-title ${
                isDarkTheme ? 'text-white' : 'text-[#1a102a]'
              }`}>
                Подобрать стиль
              </h3>
              <p className={`text-xs mt-0.5 ${
                isDarkTheme ? 'text-stone-400' : 'text-[#8c8099]'
              }`}>
                Образ под настроение
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#a89cb3] group-hover:text-[#e83269] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
          </div>
        </button>

        {/* Card 2: Мой уход */}
        <button
          id="action-card-care"
          onClick={() => onNavigate('profile')}
          type="button"
          className={`group flex flex-col justify-between p-4 rounded-[28px] text-left transition-all duration-200 active:scale-[0.98] relative overflow-hidden ${
            isDarkTheme
              ? 'liquid-glass-card-dark border-white/[0.08] hover:border-white/20'
              : 'bg-white/85 backdrop-blur-md border border-white/90 shadow-[0_4px_20px_rgba(244,93,139,0.08)] hover:shadow-[0_8px_25px_rgba(244,93,139,0.15)]'
          }`}
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-11 h-11 rounded-2xl bg-[#fff0f5] border border-pink-100 flex items-center justify-center text-[#e83269] group-hover:scale-105 transition-transform shadow-2xs">
              <Heart className="w-5 h-5 text-[#e83269]" />
            </div>
            <span className="text-pink-300 text-xs select-none">✦</span>
          </div>

          <div className="mt-4 flex items-end justify-between w-full">
            <div>
              <h3 className={`font-bold text-sm sm:text-base leading-tight font-title ${
                isDarkTheme ? 'text-white' : 'text-[#1a102a]'
              }`}>
                Мой уход
              </h3>
              <p className={`text-xs mt-0.5 ${
                isDarkTheme ? 'text-stone-400' : 'text-[#8c8099]'
              }`}>
                План и прогресс
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#a89cb3] group-hover:text-[#e83269] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
          </div>
        </button>

        {/* Card 3: Записаться */}
        <button
          id="action-card-booking"
          onClick={() => onNavigate('booking')}
          type="button"
          className={`group flex flex-col justify-between p-4 rounded-[28px] text-left transition-all duration-200 active:scale-[0.98] relative overflow-hidden ${
            isDarkTheme
              ? 'liquid-glass-card-dark border-white/[0.08] hover:border-white/20'
              : 'bg-white/85 backdrop-blur-md border border-white/90 shadow-[0_4px_20px_rgba(244,93,139,0.08)] hover:shadow-[0_8px_25px_rgba(244,93,139,0.15)]'
          }`}
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-11 h-11 rounded-2xl bg-[#fff0f5] border border-pink-100 flex items-center justify-center text-[#e83269] group-hover:scale-105 transition-transform shadow-2xs">
              <Calendar className="w-5 h-5 text-[#e83269]" />
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between w-full">
            <div>
              <h3 className={`font-bold text-sm sm:text-base leading-tight font-title ${
                isDarkTheme ? 'text-white' : 'text-[#1a102a]'
              }`}>
                Записаться
              </h3>
              <p className={`text-xs mt-0.5 ${
                isDarkTheme ? 'text-stone-400' : 'text-[#8c8099]'
              }`}>
                Онлайн и офлайн
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#a89cb3] group-hover:text-[#e83269] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
          </div>
        </button>

        {/* Card 4: Клуб */}
        <button
          id="action-card-club"
          onClick={() => onNavigate('club')}
          type="button"
          className={`group flex flex-col justify-between p-4 rounded-[28px] text-left transition-all duration-200 active:scale-[0.98] relative overflow-hidden ${
            isDarkTheme
              ? 'liquid-glass-card-dark border-white/[0.08] hover:border-white/20'
              : 'bg-white/85 backdrop-blur-md border border-white/90 shadow-[0_4px_20px_rgba(244,93,139,0.08)] hover:shadow-[0_8px_25px_rgba(244,93,139,0.15)]'
          }`}
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-11 h-11 rounded-2xl bg-[#fff0f5] border border-pink-100 flex items-center justify-center text-[#e83269] group-hover:scale-105 transition-transform shadow-2xs">
              <Ticket className="w-5 h-5 text-[#e83269]" />
            </div>
            <span className="text-pink-300 text-xs select-none">✦</span>
          </div>

          <div className="mt-4 flex items-end justify-between w-full">
            <div>
              <h3 className={`font-bold text-sm sm:text-base leading-tight font-title ${
                isDarkTheme ? 'text-white' : 'text-[#1a102a]'
              }`}>
                Клуб
              </h3>
              <p className={`text-xs mt-0.5 ${
                isDarkTheme ? 'text-stone-400' : 'text-[#8c8099]'
              }`}>
                Билетики • Привилегии
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#a89cb3] group-hover:text-[#e83269] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
          </div>
        </button>
      </div>

      {/* =========================================================================
          3. MASCOT ASSISTANT BANNER: Exact Nezhity AI card from the reference image
          ========================================================================= */}
      <div
        id="mascot-assistant-banner"
        onClick={() => onNavigate('nezhity')}
        className={`rounded-[28px] p-4 transition-all duration-200 relative overflow-hidden flex items-center justify-between gap-3 cursor-pointer group active:scale-[0.99] ${
          isDarkTheme
            ? 'liquid-glass-card-dark'
            : 'bg-white/90 backdrop-blur-md border border-white/90 shadow-[0_6px_25px_rgba(244,93,139,0.08)] hover:shadow-[0_8px_30px_rgba(244,93,139,0.15)]'
        }`}
      >
        <div className="flex items-start gap-3 min-w-0">
          {/* Avatar with online green status dot */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#ff709b] shadow-xs bg-[#ffeef4]">
              <img
                src="/assets/art-haos-nezhity-transparent-hello.png"
                alt="Нежить"
                className="w-full h-full object-cover object-top scale-110"
              />
            </div>
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
          </div>

          {/* Assistant Info & Speech Bubble */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`font-bold text-sm ${isDarkTheme ? 'text-white' : 'text-[#1a102a]'}`}>
                Нежить
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#ff5e8c] text-white text-[9px] font-black uppercase tracking-wider">
                AI
              </span>
            </div>

            <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
              <span>●</span>
              <span>Всегда рядом</span>
            </div>

            {/* Speech Bubble */}
            <div className="bg-[#fff5f8] border border-pink-100/90 rounded-2xl rounded-tl-xs px-3.5 py-1.5 mt-2 text-xs text-[#2c1d3b] leading-snug shadow-2xs inline-block">
              <p>Привет! Я Нежить ♡</p>
              <p>Чем могу помочь сегодня?</p>
            </div>
          </div>
        </div>

        {/* Right Action Button «Написать... ↗» */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="text-pink-300 text-xs select-none">✦ ✧</div>
          <button
            type="button"
            className="px-4 py-2 rounded-full border border-pink-200/80 bg-white/80 group-hover:bg-white text-xs font-semibold text-[#8b7e98] group-hover:text-[#1a102a] flex items-center gap-1.5 shadow-xs transition-all"
          >
            <span>Написать...</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          3. BENTO-ДАШБОРД РИТУАЛОВ (Nail Health, Cuticle Care, Sparkle Idea & Club)
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Bento 1: ЗДОРОВЬЕ НОГТЕЙ & ЦИКЛ КОРРЕКЦИИ */}
        <div
          id="bento-nail-health"
          className={`p-4 rounded-3xl transition-all duration-300 flex flex-col justify-between ${
            isDarkTheme ? 'liquid-glass-card-dark' : 'liquid-glass-card-light'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                isDarkTheme ? 'bg-white/10 text-stone-300' : 'bg-stone-100 text-stone-700'
              }`}>
                <Activity className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-wider ${
                  isDarkTheme ? 'text-stone-300' : 'text-stone-700'
                }`}
              >
                Здоровье твоих ногтей
              </span>
            </div>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDarkTheme ? 'bg-white/10 text-stone-300' : 'bg-stone-100 text-stone-700'
              }`}
            >
              Идеальный цикл
            </span>
          </div>

          {/* Metric display with Progress Ring Bar */}
          <div className="my-3 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-2xl sm:text-3xl font-serif font-bold ${
                    isDarkTheme ? 'text-white' : 'text-stone-900'
                  }`}
                >
                  {daysUntilCorrection} дней
                </span>
                <span
                  className={`text-xs ${
                    isDarkTheme ? 'text-stone-400' : 'text-stone-500'
                  }`}
                >
                  до коррекции
                </span>
              </div>
              <p
                className={`text-[11px] mt-0.5 leading-relaxed ${
                  isDarkTheme ? 'text-stone-300' : 'text-stone-600'
                }`}
              >
                {wearDaysPassed}-й день носки · архитектура держится безупречно ✨
              </p>
            </div>

            {/* Circular mini gauge */}
            <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className={isDarkTheme ? 'text-white/10' : 'text-stone-200'}
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={isDarkTheme ? 'text-rose-400/80 transition-all duration-700 ease-out' : 'text-[#854b61] transition-all duration-700 ease-out'}
                  strokeDasharray={`${wearPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span
                className={`absolute text-[10px] font-bold ${
                  isDarkTheme ? 'text-white' : 'text-stone-800'
                }`}
              >
                {wearPercentage}%
              </span>
            </div>
          </div>

          <div
            className={`p-2.5 rounded-2xl flex items-center justify-between text-xs ${
              isDarkTheme ? 'bg-black/30 border border-white/5' : 'bg-stone-50 border border-stone-200/60'
            }`}
          >
            <span
              className={`text-[11px] ${
                isDarkTheme ? 'text-stone-300' : 'text-stone-600'
              }`}
            >
              Рекомендованный срок носки покрытия — 3 недели
            </span>
            <button
              onClick={() => onNavigate('booking')}
              type="button"
              className={`text-[11px] font-bold whitespace-nowrap ml-2 ${
                isDarkTheme ? 'text-stone-300 hover:text-white' : 'text-stone-800 hover:text-black'
              }`}
            >
              Выбрать слот →
            </button>
          </div>
        </div>

        {/* Bento 2: РИТУАЛ ЗАБОТЫ (Масло для кутикулы) */}
        <div
          id="bento-cuticle-care"
          className={`p-4 rounded-3xl transition-all duration-300 flex flex-col justify-between ${
            isDarkTheme ? 'liquid-glass-card-dark' : 'liquid-glass-card-light'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                isDarkTheme ? 'bg-white/10 text-rose-300' : 'bg-rose-50 text-[#854b61]'
              }`}>
                <Droplets className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-wider ${
                  isDarkTheme ? 'text-stone-300' : 'text-stone-700'
                }`}
              >
                Ежедневный ритуал ухода
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-stone-300">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>{careDays}/7 стрик</span>
            </div>
          </div>

          <div className="my-2.5">
            <h4
              className={`font-serif font-bold text-base ${
                isDarkTheme ? 'text-white' : 'text-stone-900'
              }`}
            >
              Капли масла для кутикулы
            </h4>
            <p
              className={`text-[11px] mt-0.5 ${
                isDarkTheme ? 'text-stone-300' : 'text-stone-600'
              }`}
            >
              Питает матрикс ногтя и сохраняет глянец до 4 недель без сколов.
            </p>

            {/* Streak progress bars */}
            <div className="grid grid-cols-7 gap-1.5 mt-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const isFilled = day <= careDays;
                return (
                  <div
                    key={day}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isFilled
                        ? isDarkTheme ? 'bg-rose-400/80 shadow-[0_0_6px_rgba(251,113,133,0.3)]' : 'bg-[#854b61]'
                        : isDarkTheme
                        ? 'bg-white/10'
                        : 'bg-stone-200'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Tactile Liquid Glass Button */}
          <button
            id="btn-toggle-cuticle"
            onClick={onToggleCuticleCare}
            type="button"
            className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all duration-200 active:scale-95 ${
              cuticleApplied
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                : isDarkTheme
                ? 'bg-white/10 hover:bg-white/15 border border-white/10 text-stone-100'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5" />
              <span>{cuticleApplied ? 'Масло нанесено сегодня' : 'Нанести масло сейчас (+50 баллов)'}</span>
            </span>
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                cuticleApplied ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white'
              }`}
            >
              <Check className="w-3 h-3" />
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          4. INTERACTIVE CAPSULE: Идея дизайна от Нежити & Console Toolbar
          ========================================================================= */}
      <div
        id="capsule-idea-generator"
        className={`p-4 rounded-3xl relative overflow-hidden transition-all duration-300 ${
          isDarkTheme ? 'liquid-glass-card-dark' : 'liquid-glass-card-light'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
              isDarkTheme ? 'bg-white/10 border border-white/10 text-stone-200' : 'bg-stone-100 border border-stone-200 text-stone-800'
            }`}>
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-black uppercase tracking-wider ${
                    isDarkTheme ? 'text-stone-300' : 'text-stone-700'
                  }`}
                >
                  Генератор Нежити
                </span>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                  isDarkTheme ? 'bg-white/10 text-stone-300' : 'bg-stone-100 text-stone-700'
                }`}>
                  AI Сет
                </span>
              </div>
              <p
                className={`text-xs mt-0.5 ${
                  isDarkTheme ? 'text-stone-300' : 'text-stone-600'
                }`}
              >
                Не знаешь, какой маникюр сделать? Доверь выбор маскоту!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-generate-nail-idea"
              onClick={handleGenerateIdea}
              disabled={isSparklingIdea}
              type="button"
              className={`liquid-candy-pill px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all flex-1 sm:flex-initial ${
                isDarkTheme
                  ? 'bg-white text-stone-950 hover:bg-stone-100'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSparklingIdea ? 'animate-spin' : 'text-rose-400'}`} />
              <span>{isSparklingIdea ? 'Колдуем...' : 'Идея дизайна от Нежити'}</span>
            </button>

            <button
              id="btn-console-log-main"
              onClick={handleConsoleLogAction}
              type="button"
              title="Выводит 'Кнопка нажата!' в консоль браузера"
              className={`p-2.5 rounded-2xl border transition-all active:scale-95 ${
                isDarkTheme
                  ? 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                  : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Terminal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. BENTO: АКТИВНЫЙ ВИЗИТ & КЛУБНАЯ КАРТА (Club Privileges)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Active Booking Card */}
        {activeBooking ? (
          <div
            id="card-active-appointment"
            onClick={onOpenBookingDetails}
            className={`p-4 rounded-3xl cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between ${
              isDarkTheme ? 'liquid-glass-card-dark' : 'liquid-glass-card-light'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                    isDarkTheme
                      ? 'bg-white/10 text-stone-300 border border-white/10'
                      : 'bg-stone-100 text-stone-800'
                  }`}
                >
                  {activeBooking.status || 'Запись подтверждена'}
                </span>
                <h4
                  className={`font-serif font-bold text-sm sm:text-base mt-2 ${
                    isDarkTheme ? 'text-white' : 'text-stone-900'
                  }`}
                >
                  {activeBooking.service}
                </h4>
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDarkTheme ? 'bg-white/10 text-stone-300' : 'bg-stone-100 text-stone-700'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
              <span
                className={`flex items-center gap-1.5 ${
                  isDarkTheme ? 'text-stone-300' : 'text-stone-600'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>
                  {activeBooking.date}, {activeBooking.time} · {activeBooking.master}
                </span>
              </span>
              <span className="font-serif font-bold text-stone-200">
                {activeBooking.price?.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
        ) : (
          <div
            id="card-no-active-appointment"
            onClick={() => onNavigate('booking')}
            className={`p-4 rounded-3xl cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between ${
              isDarkTheme ? 'liquid-glass-card-dark' : 'liquid-glass-card-light'
            }`}
          >
            <div>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                  isDarkTheme ? 'bg-white/10 text-stone-300' : 'bg-stone-100 text-stone-700'
                }`}
              >
                Твой визит
              </span>
              <h4
                className={`font-serif font-bold text-sm sm:text-base mt-2 ${
                  isDarkTheme ? 'text-white' : 'text-stone-900'
                }`}
              >
                Нет активных записей
              </h4>
              <p
                className={`text-xs mt-0.5 ${
                  isDarkTheme ? 'text-stone-400' : 'text-stone-500'
                }`}
              >
                Выбери удобный слот к мастеру Ангелине
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className={`text-[11px] font-medium ${
                isDarkTheme ? 'text-stone-300' : 'text-stone-600'
              }`}>
                Спа-парафин в подарок ♡
              </span>
              <span className={`text-xs font-bold flex items-center gap-1 ${
                isDarkTheme ? 'text-stone-200' : 'text-stone-900'
              }`}>
                Записаться <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        )}

        {/* Club Privileges Bento Card */}
        <div
          id="bento-club-privileges"
          onClick={() => onNavigate('club')}
          className={`p-4 rounded-3xl cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between ${
            isDarkTheme ? 'liquid-glass-card-dark' : 'liquid-glass-card-light'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                  isDarkTheme
                    ? 'bg-white/10 text-stone-300 border border-white/10'
                    : 'bg-stone-100 text-stone-800'
                }`}
              >
                Твой VIP Club
              </span>
              <h4
                className={`font-serif font-bold text-sm sm:text-base mt-2 ${
                  isDarkTheme ? 'text-white' : 'text-stone-900'
                }`}
              >
                Колесо Фортуны & Кристаллы
              </h4>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
              isDarkTheme ? 'bg-white/10 border border-white/10 text-amber-300' : 'bg-stone-100 text-stone-800'
            }`}>
              <Crown className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
            <span className={`flex items-center gap-1.5 font-medium ${
              isDarkTheme ? 'text-stone-300' : 'text-stone-700'
            }`}>
              <Ticket className="w-3.5 h-3.5 text-stone-400" />
              <span>{tickets} бесплатных вращения</span>
            </span>
            <span className={`text-xs font-bold flex items-center gap-1 ${
              isDarkTheme ? 'text-stone-300' : 'text-stone-900'
            }`}>
              Крутить <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          6. ART ATELIER: Трендовые сеты ногтей студии
          ========================================================================= */}
      <div id="section-art-atelier" className="flex flex-col gap-3 mt-1">
        <div className="flex items-center justify-between">
          <div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] block ${
                isDarkTheme ? 'text-stone-400' : 'text-stone-500'
              }`}
            >
              Каталог образов
            </span>
            <h2
              className={`font-serif font-bold text-xl ${
                isDarkTheme ? 'text-white' : 'text-stone-900'
              }`}
            >
              ART ATELIER
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {[
              { id: 'all', label: 'Все' },
              { id: 'goth', label: 'Готика' },
              { id: 'neon', label: 'Неон' },
              { id: 'cyber', label: 'Кибер' },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
                  type="button"
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? isDarkTheme ? 'bg-white/20 text-white border border-white/20' : 'bg-stone-900 text-white'
                      : isDarkTheme
                      ? 'bg-white/5 text-stone-400 hover:text-white'
                      : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sets Grid */}
        <div className="atelier-grid-adaptive grid">
          {filteredSets.map((set) => {
            const isFav = favorites.includes(set.id);
            return (
              <div
                key={set.id}
                id={`card-set-${set.id}`}
                onClick={() => onSelectSetToBook(set)}
                className={`group rounded-3xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between ${
                  isDarkTheme ? 'liquid-glass-card-dark' : 'liquid-glass-card-light'
                }`}
              >
                {/* Image & Badges */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={set.imageUrl}
                    alt={set.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-white">
                      {set.category}
                    </span>

                    <button
                      onClick={(e) => toggleFavorite(set.id, e)}
                      type="button"
                      aria-label="В избранное"
                      className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-transform active:scale-90"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFav ? 'fill-rose-400 text-rose-400' : 'text-white'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-xl bg-black/70 backdrop-blur-md text-white font-serif font-bold text-xs border border-white/10">
                    {set.price.toLocaleString('ru-RU')} ₽
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <h4
                      className={`font-serif font-bold text-sm truncate ${
                        isDarkTheme ? 'text-white' : 'text-stone-900'
                      }`}
                    >
                      {set.title}
                    </h4>
                    <p
                      className={`text-[11px] mt-0.5 line-clamp-1 ${
                        isDarkTheme ? 'text-stone-400' : 'text-stone-500'
                      }`}
                    >
                      {set.description}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-[10px] font-medium ${
                      isDarkTheme ? 'text-stone-400' : 'text-stone-500'
                    }`}>
                      Всё включено
                    </span>
                    <button
                      type="button"
                      className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        isDarkTheme
                          ? 'bg-white/10 border border-white/15 text-stone-200 hover:bg-white/20'
                          : 'bg-stone-900 text-white hover:bg-stone-800'
                      }`}
                    >
                      <span>Выбрать</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          7. STUDIO LOCATION & TRANSPARENT PRICING
          ========================================================================= */}
      <div
        id="card-studio-location-info"
        className={`p-4 sm:p-5 rounded-3xl transition-all ${
          isDarkTheme ? 'liquid-glass-card-dark' : 'liquid-glass-card-light'
        }`}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isDarkTheme ? 'bg-white/10 text-stone-300' : 'bg-stone-100 text-stone-700'
          }`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3
              className={`font-serif font-bold text-sm sm:text-base ${
                isDarkTheme ? 'text-white' : 'text-stone-900'
              }`}
            >
              Студия ART XAOC · «Нежная жесть»
            </h3>
            <p
              className={`text-[11px] ${
                isDarkTheme ? 'text-stone-400' : 'text-stone-500'
              }`}
            >
              Топ-мастер Ангелина · Приём один на один в уютной приватной студии
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div
            className={`p-3 rounded-2xl flex flex-col gap-0.5 ${
              isDarkTheme ? 'bg-black/30 border border-white/5' : 'bg-stone-50 border border-stone-200/60'
            }`}
          >
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              📍 Адрес студии
            </span>
            <span
              className={`font-medium ${
                isDarkTheme ? 'text-stone-200' : 'text-stone-800'
              }`}
            >
              ул. Мате Залка, д. 25
            </span>
            <span
              className={`text-[11px] ${
                isDarkTheme ? 'text-stone-400' : 'text-stone-500'
              }`}
            >
              вход с торца дома
            </span>
          </div>

          <div
            className={`p-3 rounded-2xl flex flex-col gap-0.5 ${
              isDarkTheme ? 'bg-black/30 border border-white/5' : 'bg-stone-50 border border-stone-200/60'
            }`}
          >
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              📞 Контакты & Запись
            </span>
            <div className="flex flex-wrap items-center gap-x-2 text-[11px]">
              <a
                href="tel:89279973780"
                className={`font-medium hover:text-stone-100 transition-colors ${
                  isDarkTheme ? 'text-stone-300' : 'text-stone-800'
                }`}
              >
                8 (927) 997-37-80
              </a>
              <span>·</span>
              <a
                href="tel:89806082670"
                className={`font-medium hover:text-stone-100 transition-colors ${
                  isDarkTheme ? 'text-stone-300' : 'text-stone-800'
                }`}
              >
                8 (980) 608-26-70
              </a>
            </div>
            <a
              href="https://t.me/Ni_Gelya"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[11px] font-semibold flex items-center gap-1 mt-0.5 ${
                isDarkTheme ? 'text-stone-300 hover:text-white' : 'text-stone-700 hover:text-black'
              }`}
            >
              <span>Telegram: @Ni_Gelya</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          8. RANDOM SET SUGGESTION MODAL
          ========================================================================= */}
      {selectedRandomSet && (
        <div
          id="modal-random-set-choice"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedRandomSet(null)}
        >
          <div
            className={`relative w-full max-w-sm rounded-[32px] p-5 shadow-2xl overflow-hidden transition-all animate-in zoom-in-95 duration-200 ${
              isDarkTheme ? 'liquid-glass-card-dark text-white' : 'liquid-glass-card-light text-stone-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/20 shadow-sm flex-shrink-0 bg-stone-900">
                  <img
                    src={activeLook.image}
                    alt="Нежить"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 block">
                    Выбор Нежити ✨
                  </span>
                  <h3 className="font-serif font-bold text-sm text-stone-200">
                    Твой образ на сегодня
                  </h3>
                </div>
              </div>

              <button
                id="btn-close-random-modal"
                onClick={() => setSelectedRandomSet(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Set Preview Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-3">
              <img
                src={selectedRandomSet.imageUrl}
                alt={selectedRandomSet.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-stone-200 uppercase tracking-wider">
                {selectedRandomSet.category}
              </div>
              <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-xl bg-stone-900/90 text-white font-serif font-bold text-sm shadow-md border border-white/15">
                {selectedRandomSet.price.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-1 mb-4">
              <h4 className="font-serif font-bold text-lg text-white">
                {selectedRandomSet.title}
              </h4>
              <p
                className={`text-xs leading-relaxed ${
                  isDarkTheme ? 'text-stone-300' : 'text-stone-600'
                }`}
              >
                {selectedRandomSet.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                id="btn-reroll-random-set"
                onClick={handleGenerateIdea}
                type="button"
                className="flex-1 py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 text-stone-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ещё идея</span>
              </button>

              <button
                id="btn-book-random-set"
                onClick={() => {
                  const set = selectedRandomSet;
                  setSelectedRandomSet(null);
                  onSelectSetToBook(set);
                }}
                type="button"
                className="flex-[1.5] py-2.5 px-4 rounded-2xl bg-white text-stone-950 hover:bg-stone-100 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Выбрать этот сет</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
