import React from 'react';
import { Bell, X, Sparkles, Calendar, Gift } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme: boolean;
  onOpenBooking: () => void;
  onOpenClub: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  isDarkTheme,
  onOpenBooking,
  onOpenClub,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm rounded-3xl p-5 border flex flex-col animate-in zoom-in-95 duration-200 shadow-2xl ${
          isDarkTheme
            ? 'bg-[#180f22] border-pink-500/40 text-slate-100'
            : 'bg-white border-pink-200 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-pink-400" />
            <h3 className="font-serif font-bold text-base text-pink-400">
              Оповещения ART XAOC
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 py-3 text-xs">
          {/* Item 1 */}
          <div
            onClick={() => {
              onOpenBooking();
              onClose();
            }}
            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/40 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-pink-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Ближайшая запись</span>
              </span>
              <span className="text-[10px] text-slate-400">сегодня</span>
            </div>
            <p className="text-slate-200">
              Среда, 16 апреля в 16:00 · Топ-мастер Ангелина.
            </p>
            <p className="text-[10px] text-pink-300 mt-1">
              Укрепление + спа-парафин подготовлены в подарок.
            </p>
          </div>

          {/* Item 2 */}
          <div
            onClick={() => {
              onOpenClub();
              onClose();
            }}
            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/40 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-pink-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" />
                <span>Колесо Фортуны</span>
              </span>
              <span className="text-[10px] text-slate-400">1 ч назад</span>
            </div>
            <p className="text-slate-200">
              У тебя есть 1 бесплатная попытка! Крути и получай до 1000 бонусов.
            </p>
          </div>

          {/* Item 3 */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-pink-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Новинка недели</span>
              </span>
              <span className="text-[10px] text-slate-400">вчера</span>
            </div>
            <p className="text-slate-200">
              Вышел эксклюзивный сет «GOTH BARBIE NEON» в каталоге Atelier.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 py-2 rounded-xl bg-white/10 text-slate-300 hover:text-white text-xs font-semibold"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};
