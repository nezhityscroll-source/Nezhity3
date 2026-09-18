import React, { useState, useEffect } from 'react';
import { Bell, Heart, ChevronDown, Clock, ChevronRight } from 'lucide-react';
import { ActiveBooking, MascotReactionEvent } from '../types';

interface HeaderProps {
  points: number;
  tickets: number;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  hasUnreadNotifications?: boolean;
  userAvatar?: string;
  activeBooking?: ActiveBooking | null;
  onOpenBookingDetails?: () => void;
  mascotReaction?: MascotReactionEvent | null;
  onClearMascotReaction?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  points: _points,
  tickets: _tickets,
  isDarkTheme,
  onToggleTheme: _onToggleTheme,
  onOpenNotifications,
  onOpenProfile,
  hasUnreadNotifications = true,
  userAvatar: _userAvatar = '/assets/art-haos-nezhity-transparent-hello.png',
  activeBooking,
  onOpenBookingDetails,
  mascotReaction: _mascotReaction,
  onClearMascotReaction: _onClearMascotReaction,
}) => {
  const [countdownText, setCountdownText] = useState<string>('');

  useEffect(() => {
    if (!activeBooking) {
      setCountdownText('');
      return;
    }

    const updateCountdown = () => {
      const target = activeBooking.targetTimestamp || Date.now() + 3 * 3600 * 1000;
      const diff = target - Date.now();

      if (diff <= 0) {
        setCountdownText('Процедура началась!');
        return;
      }

      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const fullStr =
        totalHours > 0
          ? `${totalHours} ч ${minutes} мин ${seconds} с`
          : `${minutes} мин ${seconds} с`;

      setCountdownText(fullStr);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeBooking]);

  return (
    <header
      id="app-header"
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        isDarkTheme
          ? 'bg-[#141318]/95 text-slate-100 border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
          : 'bg-[#fdf7f9]/90 text-[#181126] border-b border-pink-100/50 shadow-[0_2px_15px_rgba(244,93,139,0.04)]'
      } backdrop-blur-xl`}
    >
      {/* Visual Indicator Banner if activeBooking exists */}
      {activeBooking && (
        <div
          id="header-booking-indicator-strip"
          onClick={onOpenBookingDetails}
          title="Нажми для просмотра деталей записи"
          className="w-full bg-[#ffedf3] border-b border-pink-200/60 px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs cursor-pointer transition-all hover:bg-[#ffe2eb] group select-none"
        >
          <div className="max-w-md mx-auto w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-600" />
              </span>

              <span className="text-[11px] font-bold text-pink-700 truncate">
                Ближайший ритуал:{' '}
                <span className="text-slate-800 font-medium">{activeBooking.service}</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
              <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-pink-800 bg-white/80 px-2 py-0.5 rounded-full border border-pink-200 shadow-2xs">
                <Clock className="w-3 h-3 text-pink-500 animate-pulse" />
                <span>{countdownText || 'Считаем...'}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-pink-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      )}

      {/* Main Header Bar - Exactly as in the user's reference image */}
      <div className="max-w-md mx-auto h-18 px-4 flex items-center justify-between relative">
        {/* Subtle center floating bat watermark */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none opacity-30 select-none">
          <svg className="w-12 h-6 text-pink-300" viewBox="0 0 100 50" fill="currentColor">
            <path d="M50,22 C53,16 58,16 61,20 C66,13 74,12 79,18 C87,11 96,16 98,28 C91,26 84,29 80,36 C74,31 66,33 62,39 C57,33 52,35 50,38 C48,35 43,33 38,39 C34,33 26,31 20,36 C16,29 9,26 2,28 C4,16 13,11 21,18 C26,12 34,13 39,20 C42,16 47,16 50,22 Z" />
          </svg>
        </div>

        {/* Brand: AX Pink Circle + ART XAOC + Dropdown Chevron + Нежная жесть */}
        <div
          id="brand-logo"
          onClick={onOpenProfile}
          className="flex items-center gap-3 cursor-pointer select-none group relative z-10"
        >
          {/* AX Pink Circle Avatar */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#ff608e] via-[#f44a7e] to-[#ec3870] flex items-center justify-center font-bold text-sm tracking-wide text-white shadow-[0_4px_14px_rgba(244,93,139,0.35)] flex-shrink-0 group-hover:scale-105 transition-transform">
            AX
          </div>

          {/* Title and Subtitle with Dropdown Chevron */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span
                className={`text-base font-black tracking-wide leading-tight ${
                  isDarkTheme ? 'text-white' : 'text-[#1a102a]'
                }`}
              >
                ART XAOC
              </span>
              <ChevronDown className="w-4 h-4 text-[#1a102a] stroke-[2.5]" />
            </div>
            <span
              className={`text-xs -mt-0.5 tracking-normal ${
                isDarkTheme ? 'text-pink-300/70' : 'text-[#9c8ea6]'
              }`}
            >
              Нежная жесть
            </span>
          </div>
        </div>

        {/* Right side buttons: White Bell with notification dot + Hot Pink Heart */}
        <div className="flex items-center gap-2.5 relative z-10">
          {/* White Circular Notification Bell */}
          <button
            id="btn-notifications"
            onClick={onOpenNotifications}
            aria-label="Уведомления"
            className="w-11 h-11 rounded-full bg-white shadow-[0_3px_12px_rgba(0,0,0,0.06)] border border-pink-100/60 flex items-center justify-center relative cursor-pointer active:scale-95 transition-all hover:shadow-[0_4px_16px_rgba(244,93,139,0.15)]"
          >
            <Bell className="w-5 h-5 text-[#281c38]" />
            {hasUnreadNotifications && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#f43f5e] ring-2 ring-white" />
            )}
          </button>

          {/* Hot Pink Circular Heart Button */}
          <button
            id="btn-favorites-heart"
            onClick={onOpenProfile}
            aria-label="Избранное и профиль"
            className="w-11 h-11 rounded-full bg-[#f45d8b] shadow-[0_4px_16px_rgba(244,93,139,0.4)] flex items-center justify-center cursor-pointer active:scale-95 transition-all hover:bg-[#eb4b7b]"
          >
            <Heart className="w-5 h-5 text-white stroke-[2.2]" />
          </button>
        </div>
      </div>
    </header>
  );
};

