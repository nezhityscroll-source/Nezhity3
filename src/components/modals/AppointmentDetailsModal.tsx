import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  X,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { ActiveBooking } from '../../types';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: ActiveBooking | null;
  isDarkTheme: boolean;
  onReschedule: () => void;
  onCancelBooking: () => void;
}

export const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
  isDarkTheme,
  onReschedule,
  onCancelBooking,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, isPast: false });

  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    if (!booking) return;

    const calculateTime = () => {
      const target = booking.targetTimestamp || Date.now() + 3 * 3600 * 1000;
      const diff = target - Date.now();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [booking]);

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm rounded-3xl p-5 border flex flex-col animate-in zoom-in-95 duration-200 shadow-2xl ${
          isDarkTheme
            ? 'bg-[#190c24] border-pink-500/40 text-slate-100'
            : 'bg-white border-pink-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500" />
            </span>
            <h3 className="font-serif font-bold text-base text-pink-300">
              Ближайшая процедура
            </h3>
          </div>
          <button
            onClick={() => {
              setConfirmCancel(false);
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Countdown Banner */}
        <div className="my-3.5 p-3 rounded-2xl bg-gradient-to-r from-pink-950/70 via-purple-950/60 to-pink-950/70 border border-pink-500/30 text-center">
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-pink-400">
            {timeLeft.isPast ? 'Время процедуры!' : 'До начала процедуры осталось:'}
          </span>

          {timeLeft.isPast ? (
            <div className="text-base font-bold text-emerald-400 mt-1">
              Процедура началась или завершена!
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mt-1.5">
              <div className="flex flex-col items-center">
                <span className="font-mono text-2xl font-black text-pink-300">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">час</span>
              </div>
              <span className="text-pink-500 font-black text-xl mb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="font-mono text-2xl font-black text-pink-300">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">мин</span>
              </div>
              <span className="text-pink-500 font-black text-xl mb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="font-mono text-2xl font-black text-pink-400">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">сек</span>
              </div>
            </div>
          )}
        </div>

        {/* Procedure details list */}
        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[10px] text-pink-400 uppercase font-bold tracking-wider">
              Ритуал
            </div>
            <div className="font-bold text-slate-100 text-sm mt-0.5">
              {booking.service}
            </div>
            {booking.gift && (
              <div className="text-[11px] text-pink-300 mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-pink-400" />
                <span>{booking.gift}</span>
              </div>
            )}
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5 text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
              <span>
                <strong>Дата и время:</strong> {booking.date}, {booking.time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
              <span>
                <strong>Мастер:</strong> {booking.master} (в студии принимает одна)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-pink-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Адрес:</strong> ул. Мате Залка, д. 25 (вход с торца дома)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 text-pink-400 flex-shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-1">
                <strong>Телефоны:</strong>
                <a href="tel:89279973780" className="hover:text-pink-300">
                  8 (927) 997-37-80
                </a>
                <span>·</span>
                <a href="tel:89806082670" className="hover:text-pink-300">
                  8 (980) 608-26-70
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Telegram Direct link */}
        <div className="mt-3">
          <a
            href="https://t.me/Ni_Gelya"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Написать мастеру в Telegram (@Ni_Gelya)</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
          {!confirmCancel ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReschedule();
                }}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Перенести запись</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmCancel(true)}
                className="py-2 px-3 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 border border-transparent text-slate-400 font-semibold text-xs transition-colors"
              >
                Отменить
              </button>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-center space-y-2 animate-in fade-in">
              <div className="text-[11px] text-red-200 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Точно отменить запись?</span>
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    onCancelBooking();
                    setConfirmCancel(false);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs"
                >
                  Да, отменить
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmCancel(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-slate-300 text-xs"
                >
                  Назад
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
