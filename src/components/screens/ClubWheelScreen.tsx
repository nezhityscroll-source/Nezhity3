import React, { useState } from 'react';
import {
  Sparkles,
  Gift,
  Gem,
  Heart,
  Crown,
  Ticket,
  CheckCircle2,
  Info,
  HelpCircle,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WheelSegment } from '../../types';
import { WHEEL_SEGMENTS } from '../../data/servicesData';

interface ClubWheelScreenProps {
  isDarkTheme: boolean;
  points: number;
  tickets: number;
  onAwardPrize: (segment: WheelSegment) => void;
  onConsumeTicket: () => boolean;
  onAddTicket: () => void;
  onQuestCompleted?: (name: string, points?: number) => void;
}

export const ClubWheelScreen: React.FC<ClubWheelScreenProps> = ({
  isDarkTheme,
  points,
  tickets,
  onAwardPrize,
  onConsumeTicket,
  onAddTicket,
  onQuestCompleted,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<WheelSegment | null>(null);
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [friendCopied, setFriendCopied] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const numSegments = WHEEL_SEGMENTS.length;
  const segmentAngle = 360 / numSegments;

  const handleInviteFriend = () => {
    onAddTicket();
    setFriendCopied(true);
    onQuestCompleted?.('Приведи подругу', 100);
    setTimeout(() => setFriendCopied(false), 3000);
  };

  const handleMapReview = () => {
    if (!reviewSubmitted) {
      onAddTicket();
      setReviewSubmitted(true);
      onQuestCompleted?.('Отзыв на картах', 100);
    }
  };

  const handleSpin = () => {
    if (isSpinning) return;

    // Check tickets
    if (tickets <= 0) {
      alert('У тебя закончились попытки! Выполни простое задание ниже, чтобы получить ещё ♡');
      setShowHowToModal(true);
      return;
    }

    const success = onConsumeTicket();
    if (!success) return;

    setIsSpinning(true);
    setWonPrize(null);

    // Pick random prize
    const targetIndex = Math.floor(Math.random() * numSegments);
    const targetSegment = WHEEL_SEGMENTS[targetIndex];

    // Pointer is at the TOP (270 deg or 0/360 depending on coordinate system).
    // Let's align: 0 deg points to top.
    // Segment i occupies angle from (i * segmentAngle) to ((i + 1) * segmentAngle).
    // Midpoint of segment i is (i + 0.5) * segmentAngle.
    // To bring segment i to top (0 deg), rotation angle = (360 - midpoint).
    const segmentCenter = (targetIndex + 0.5) * segmentAngle;
    const additionalTurns = 5 * 360; // 5 full spins
    const targetRotation = wheelRotation + additionalTurns + (360 - (wheelRotation % 360)) + (360 - segmentCenter);

    setWheelRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(targetSegment);
      onAwardPrize(targetSegment);

      // Confetti burst!
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#ec4899', '#f43f5e', '#a855f7', '#fbbf24', '#ffffff'],
        });
      } catch {
        // ignore
      }
    }, 4500);
  };

  return (
    <div id="screen-club-wheel" className="flex flex-col gap-4 pb-28 animate-in fade-in duration-300">
      {/* HEADER TITLE */}
      <div className="text-center pt-1 px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-extrabold uppercase tracking-widest mb-1.5">
          <Sparkles className="w-3 h-3 animate-spin text-pink-400" />
          <span>КЛУБ ПРИВИЛЕГИЙ</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-fuchsia-300 drop-shadow-[0_2px_15px_rgba(219,39,119,0.5)]">
          Колесо фортуны <span className="italic font-normal text-pink-400">♡</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Крути и получай гарантированные подарки к своему ритуалу!
        </p>
      </div>

      {/* NEZHYT COMPANION BANNER (Clean, balanced placement above the wheel) */}
      <div
        id="banner-club-nezhity"
        className={`p-3.5 rounded-3xl border flex items-center gap-3.5 transition-all shadow-lg ${
          isDarkTheme
            ? 'bg-gradient-to-r from-[#22102e] via-[#1a0c24] to-[#2a0e33] border-pink-500/30 text-slate-100'
            : 'bg-white border-pink-200 text-slate-800 shadow-md'
        }`}
      >
        <div className="relative flex-shrink-0 w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden ring-2 ring-pink-500/60 shadow-[0_0_20px_rgba(219,39,119,0.4)] bg-[#120817]">
          <img
            src="/assets/art-haos-nezhity-transparent-joy-face-fixed.png"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('art-haos-nezhity-transparent-hello.png')) {
                target.src = '/assets/art-haos-nezhity-transparent-hello.png';
              }
            }}
            alt="Нежить Восторг"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain p-1 hover:scale-110 transition-transform"
          />
          <div className="absolute bottom-0 inset-x-0 bg-pink-600/90 text-white text-[8px] font-black uppercase text-center py-0.5">
            Восторг! ✨
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
              Хранительница клуба
            </span>
            <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-black border border-pink-500/30">
              Попыток: {tickets}
            </span>
          </div>
          <p className="text-xs text-pink-100/90 italic leading-snug">
            «Крути Колесо Фортуны! Я приготовила для тебя крутые призы: скидки, дизайны и спа-уход без проигрыша ♡»
          </p>
        </div>
      </div>

      {/* WHEEL CONTAINER (Unobstructed, centered) */}
      <div className="relative flex flex-col items-center justify-center my-2 select-none">
        {/* Ambient Glows */}
        <div className="absolute w-72 h-72 rounded-full bg-pink-600/25 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute w-80 h-80 rounded-full bg-purple-600/20 blur-3xl -z-10 pointer-events-none" />

        {/* POINTER NEEDLE (Pointing down to the top segment) */}
        <div className="relative z-30 mb-[-14px] flex flex-col items-center">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-white filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] animate-pulse" />
        </div>

        {/* THE WHEEL SVG */}
        <div className="relative w-[300px] h-[300px] sm:w-[330px] sm:h-[330px] rounded-full p-2.5 bg-gradient-to-tr from-purple-900 via-pink-600 to-rose-400 shadow-[0_0_40px_rgba(219,39,119,0.45)] ring-4 ring-pink-500/30">
          <div
            id="wheel-rotor"
            className="w-full h-full rounded-full relative overflow-hidden transition-transform duration-[4500ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
            style={{
              transform: `rotate(${wheelRotation}deg)`,
            }}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full rounded-full"
            >
              {WHEEL_SEGMENTS.map((segment, index) => {
                const anglePerSegment = 360 / numSegments;
                const startAngle = index * anglePerSegment - 90;
                const endAngle = startAngle + anglePerSegment;

                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;

                const x1 = 50 + 50 * Math.cos(startRad);
                const y1 = 50 + 50 * Math.sin(startRad);
                const x2 = 50 + 50 * Math.cos(endRad);
                const y2 = 50 + 50 * Math.sin(endRad);

                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                // Alternate between soft pastel purple & pink
                const fillColor = index % 2 === 0 ? '#fff1f7' : '#f5e8ff';

                // Midpoint angle for label positioning
                const midAngle = startAngle + anglePerSegment / 2;
                const midRad = (midAngle * Math.PI) / 180;
                const textX = 50 + 31 * Math.cos(midRad);
                const textY = 50 + 31 * Math.sin(midRad);

                return (
                  <g key={segment.id}>
                    <path
                      d={pathData}
                      fill={fillColor}
                      stroke="#f472b6"
                      strokeWidth="0.5"
                    />

                    {/* Text content inside the slice */}
                    <g
                      transform={`translate(${textX}, ${textY}) rotate(${midAngle + 90})`}
                    >
                      <text
                        x="0"
                        y="-4"
                        textAnchor="middle"
                        fontSize="3.8"
                        fontWeight="800"
                        fill="#831843"
                        fontFamily="Playfair Display, serif"
                      >
                        {segment.label}
                      </text>
                      <text
                        x="0"
                        y="1.5"
                        textAnchor="middle"
                        fontSize="2.8"
                        fontWeight="600"
                        fill="#be185d"
                        fontFamily="Manrope, sans-serif"
                      >
                        {segment.sublabel}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* WHEEL CENTER HUB / BUTTON (Image 8) */}
          <button
            id="btn-spin-wheel"
            onClick={handleSpin}
            disabled={isSpinning}
            type="button"
            className="absolute inset-0 m-auto w-24 h-24 sm:w-26 sm:h-26 rounded-full bg-gradient-to-tr from-[#250d2e] via-[#1a0822] to-[#3a1044] border-2 border-pink-400 text-white flex flex-col items-center justify-center p-1 shadow-[0_0_20px_rgba(219,39,119,0.7)] active:scale-95 hover:scale-105 transition-all z-30 cursor-pointer disabled:opacity-80"
          >
            <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
            <span className="font-serif font-bold text-sm text-pink-200 mt-0.5">
              {isSpinning ? 'Крутим...' : 'Крутить'}
            </span>
            <span className="text-[9px] font-semibold text-pink-400">
              {tickets > 0 ? `${tickets} ${tickets === 1 ? 'попытка' : 'попытки'}` : '0 попыток'}
            </span>
          </button>
        </div>
      </div>

      {/* QUESTS & OPPORTUNITIES CARDS (Promotions requested by user) */}
      <div id="section-earn-tickets" className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-pink-400" />
            <h3 className="font-serif font-bold text-sm sm:text-base text-pink-200">
              Как получить попытки ♡
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            Акции и задания
          </span>
        </div>

        {/* Promo 1: Приведи друга */}
        <div
          id="promo-bring-friend"
          className={`p-3.5 rounded-2xl border transition-all ${
            isDarkTheme
              ? 'bg-[#180f22] border-pink-900/50 text-slate-200'
              : 'bg-white border-pink-200 text-slate-800 shadow-sm'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 text-[10px] font-black uppercase tracking-wider border border-pink-500/30">
                  Акция: Приведи друга
                </span>
                <span className="text-xs font-bold text-emerald-400">+1 попытка</span>
              </div>
              <p className="text-xs text-slate-200 font-medium mt-0.5">
                Друг получает <strong className="text-pink-400">скидку 10%</strong> на первый визит как новый клиент, а ты получаешь <strong className="text-pink-400">1 попытку</strong> на Колесе Фортуны!
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400 font-mono">
              Промокод: <strong className="text-pink-300">FRIEND-XAOC10</strong>
            </span>
            <button
              id="btn-invite-friend"
              onClick={handleInviteFriend}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                friendCopied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-pink-600 hover:bg-pink-500 text-white active:scale-95 shadow-sm'
              }`}
            >
              {friendCopied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Попытка начислена!</span>
                </>
              ) : (
                <>
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Пригласить (+1 попытка)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Promo 2: Отзыв на картах */}
        <div
          id="promo-maps-review"
          className={`p-3.5 rounded-2xl border transition-all ${
            isDarkTheme
              ? 'bg-[#180f22] border-pink-900/50 text-slate-200'
              : 'bg-white border-pink-200 text-slate-800 shadow-sm'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider border border-purple-500/30">
                  Отзыв на картах
                </span>
                <span className="text-xs font-bold text-emerald-400">+1 попытка</span>
              </div>
              <p className="text-xs text-slate-200 font-medium mt-0.5">
                Оставь честный отзыв с фото ногтей на <strong className="text-purple-300">Яндекс Картах или 2ГИС</strong> по адресу ул. Мате Залка, 25 — получи <strong className="text-pink-400">1 попытку</strong>!
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400">
              Яндекс Карты · 2ГИС
            </span>
            <button
              id="btn-claim-review-ticket"
              onClick={handleMapReview}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                reviewSubmitted
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 cursor-default'
                  : 'bg-purple-600 hover:bg-purple-500 text-white active:scale-95 shadow-sm'
              }`}
            >
              {reviewSubmitted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Отзыв учтён (+1)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Оставить отзыв (+1 попытка)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quest 3: Запись на процедуру */}
        <div
          id="promo-booking-visit"
          className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
            isDarkTheme
              ? 'bg-[#180f22]/60 border-pink-950/40 text-slate-300'
              : 'bg-pink-50/50 border-pink-100 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-xs text-slate-200">Визит в студию к Ангелине</h4>
              <p className="text-[10px] text-slate-400">Начисляется автоматически после завершения ритуала</p>
            </div>
          </div>
          <span className="text-xs font-bold text-pink-400 whitespace-nowrap">+1 попытка</span>
        </div>
      </div>

      {/* PRIZE WON MODAL */}
      {wonPrize && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 border text-center animate-in zoom-in-95 duration-200 ${
              isDarkTheme
                ? 'bg-[#1e0e29] border-pink-500/50 text-slate-100 shadow-[0_0_50px_rgba(219,39,119,0.4)]'
                : 'bg-white border-pink-200 text-slate-800 shadow-2xl'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 ring-pink-500/30 animate-bounce">
              <Trophy className="w-8 h-8 text-yellow-300" />
            </div>

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-400">
              ПОЗДРАВЛЯЕМ!
            </span>

            <h3 className="font-serif font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-400 mt-1">
              {wonPrize.label} {wonPrize.sublabel}
            </h3>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Твой приз сохранён в профиле и готов к применению при следующем ритуале!
            </p>

            <button
              id="btn-claim-prize"
              onClick={() => setWonPrize(null)}
              className="mt-5 w-full py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              Забрать приз ♡
            </button>
          </div>
        </div>
      )}

      {/* HOW TO GET TICKETS MODAL */}
      {showHowToModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 border animate-in zoom-in-95 duration-200 ${
              isDarkTheme
                ? 'bg-[#180f22] border-pink-500/40 text-slate-100'
                : 'bg-white border-pink-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-bold text-base text-pink-400 flex items-center gap-1.5">
                <Gift className="w-4 h-4" />
                <span>Как получить попытки</span>
              </h3>
              <button
                onClick={() => setShowHowToModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-pink-300">Приведи друга (Акция)</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Друг получает 10% скидку как новый клиент, а ты получаешь 1 попытку!
                  </div>
                </div>
                <span className="font-bold text-pink-400 whitespace-nowrap">+1 попытка</span>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-purple-300">Отзыв на картах (Яндекс / 2ГИС)</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Честный отзыв с фото работы по адресу ул. Мате Залка, 25
                  </div>
                </div>
                <span className="font-bold text-purple-400 whitespace-nowrap">+1 попытка</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold">Запись к мастеру Ангелине</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Начисляется после завершения любого ритуала</div>
                </div>
                <span className="font-bold text-pink-400 whitespace-nowrap">+1 попытка</span>
              </div>
            </div>

            {/* Quick demo bonus button */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  onAddTicket();
                  setShowHowToModal(false);
                }}
                className="w-full py-2 rounded-xl bg-pink-600/20 border border-pink-500/40 text-pink-300 font-bold text-xs hover:bg-pink-600/30 transition-colors"
              >
                🎁 Получить бонусную попытку (Демо-бонус)
              </button>

              <button
                onClick={() => setShowHowToModal(false)}
                className="w-full py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
