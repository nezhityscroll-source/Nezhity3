import React, { useState } from 'react';
import {
  Gem,
  Ticket,
  Calendar,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Flame,
  ShieldCheck,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  Gift,
  Share2,
  Lock,
  X,
} from 'lucide-react';
import { NAIL_DIARY_MOCK } from '../../data/servicesData';
import { GallerySet } from '../../types';

// Precomputed SHA-256 cryptographic hash of Angelina's master password (plain text never stored)
const MASTER_PASSWORD_HASH = '47d6958dbc395ee26ec41e8266f96a6bfc2c0a03bc39f3331e6a50c84c0f2f6c';

interface ProfileScreenProps {
  isDarkTheme: boolean;
  points: number;
  tickets: number;
  careDays: number;
  cuticleApplied: boolean;
  onToggleCuticleCare: () => void;
  onSelectSetToBook?: (set: GallerySet) => void;
  userAvatar?: string;
  onUpdateAvatar?: (avatarUrl: string) => void;
  onNavigateToAdmin?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  isDarkTheme,
  points,
  tickets,
  careDays,
  cuticleApplied,
  onToggleCuticleCare,
  onSelectSetToBook,
  userAvatar = '/assets/art-haos-nezhity-transparent-hello.png',
  onUpdateAvatar,
  onNavigateToAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'diary' | 'care' | 'bonuses'>('diary');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleCopyInviteCode = () => {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleVerifyMasterPin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinValue.trim();
    if (!cleanPin) {
      setPinError(true);
      return;
    }

    try {
      const msgBuffer = new TextEncoder().encode(cleanPin);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const inputHash = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      if (inputHash === MASTER_PASSWORD_HASH) {
        setShowPinModal(false);
        setPinValue('');
        setPinError(false);
        onNavigateToAdmin?.();
      } else {
        setPinError(true);
      }
    } catch {
      setPinError(true);
    }
  };

  return (
    <div id="screen-profile" className="flex flex-col gap-4 pb-28 animate-in fade-in duration-300">
      {/* PROFILE HEADER CARD */}
      <div
        id="profile-user-card"
        className={`relative overflow-hidden rounded-3xl p-4 sm:p-5 border shadow-xl ${
          isDarkTheme
            ? 'bg-gradient-to-br from-[#200f2b] via-[#160a22] to-[#260f33] border-pink-900/40 text-slate-100'
            : 'bg-white border-pink-200 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-3.5">
          {/* User Profile Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-2 ring-pink-500 shadow-xl bg-black/40">
              <img
                src={userAvatar}
                alt="Аватар профиля Ангелина"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full ring-2 ring-black" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="font-serif font-bold text-lg sm:text-xl truncate">Ангелина</h2>
              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[9px] font-extrabold uppercase tracking-widest border border-pink-500/30">
                VIP КЛИЕНТ
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              В клубе с ноября 2024 · 12 визитов
            </p>

            {/* Quick stats pills */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 text-xs font-bold">
                <Gem className="w-3.5 h-3.5 text-pink-400" />
                <span>{points.toLocaleString('ru-RU')} баллов</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-bold">
                <Ticket className="w-3.5 h-3.5 text-purple-400" />
                <span>{tickets} {tickets === 1 ? 'попытка' : 'попытки'}</span>
              </div>
            </div>

            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-pink-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 text-pink-400" />
                <span>Панель мастера (Ангелина)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SUB-TABS SELECTOR */}
      <div
        className={`flex items-center p-1 rounded-2xl border ${
          isDarkTheme ? 'bg-[#180f22] border-pink-950/60' : 'bg-pink-50/70 border-pink-200'
        }`}
      >
        <button
          onClick={() => setActiveTab('diary')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'diary'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
              : isDarkTheme
              ? 'text-slate-400 hover:text-pink-300'
              : 'text-slate-600 hover:text-pink-600'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Nail Diary</span>
        </button>

        <button
          onClick={() => setActiveTab('care')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'care'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
              : isDarkTheme
              ? 'text-slate-400 hover:text-pink-300'
              : 'text-slate-600 hover:text-pink-600'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Уход & Стрик</span>
        </button>

        <button
          onClick={() => setActiveTab('bonuses')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'bonuses'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
              : isDarkTheme
              ? 'text-slate-400 hover:text-pink-300'
              : 'text-slate-600 hover:text-pink-600'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Бонусы & Призы</span>
        </button>
      </div>

      {/* TAB CONTENT: NAIL DIARY */}
      {activeTab === 'diary' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-serif font-bold text-sm text-pink-400">
              История твоих ритуалов
            </h3>
            <span className="text-[11px] text-slate-400">2 записи</span>
          </div>

          {NAIL_DIARY_MOCK.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl p-4 border flex flex-col gap-2.5 ${
                isDarkTheme
                  ? 'bg-[#180f22] border-pink-950/60 text-slate-100'
                  : 'bg-white border-pink-100 text-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-[11px] text-pink-400 font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>
                  <h4 className="font-serif font-bold text-base mt-0.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Мастер: {item.master} · Форма: {item.shape} ({item.length})
                  </p>
                </div>

                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover ring-1 ring-pink-500/30 flex-shrink-0"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300">
                <p><strong>Заметки:</strong> {item.notes}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: CARE & STREAK */}
      {activeTab === 'care' && (
        <div className="flex flex-col gap-3">
          <div
            className={`rounded-2xl p-4 border ${
              isDarkTheme ? 'bg-[#180f22] border-pink-950/60' : 'bg-white border-pink-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-400">
                  ТРЕКЕР УХОДА
                </span>
                <h3 className="font-serif font-bold text-base mt-0.5">
                  Стрик заботы о ногтях
                </h3>
              </div>
              <div className="text-right">
                <span className="font-serif font-bold text-2xl text-pink-500">{careDays}</span>
                <span className="text-xs text-slate-400"> / 7 дней</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Ежедневное масло для кутикулы сохраняет эластичность и продлевает носку покрытия до 4+ недель.
            </p>

            <button
              onClick={onToggleCuticleCare}
              className={`mt-3 w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                cuticleApplied
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {cuticleApplied
                  ? 'Сегодня масло нанесено! (Стрик активен)'
                  : 'Отметить нанесение масла сегодня'}
              </span>
            </button>
          </div>

          <div
            className={`rounded-2xl p-4 border space-y-3 ${
              isDarkTheme ? 'bg-[#180f22] border-pink-950/60' : 'bg-white border-pink-100'
            }`}
          >
            <h4 className="font-serif font-bold text-sm text-pink-400">
              Чеклист красивых ногтей от Нежити:
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span>Не использовать ногти как инструмент для открывания банок</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span>Надевать перчатки при уборке с агрессивной химией</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span>Приходить на коррекцию вовремя (раз в 3-4 недели)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: BONUSES & PRIZES */}
      {activeTab === 'bonuses' && (
        <div className="flex flex-col gap-3">
          <div
            className={`rounded-2xl p-4 border ${
              isDarkTheme ? 'bg-[#180f22] border-pink-950/60' : 'bg-white border-pink-100'
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-400">
              АКЦИЯ ДЛЯ ДРУЗЕЙ
            </span>
            <h4 className="font-serif font-bold text-base text-pink-300 mt-0.5">
              Пригласи подругу — получи попытку!
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Твоя подруга получит <strong>скидку 10%</strong> на первый ритуал, а тебе мгновенно начислится <strong>+1 попытка</strong> на Колесе Фортуны.
            </p>

            <div className="mt-3 p-2.5 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-pink-300">FRIEND-XAOC10</span>
              <button
                onClick={handleCopyInviteCode}
                className="px-3 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold flex items-center gap-1 active:scale-95"
              >
                {copiedCode ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-white" />
                    <span>Скопировано!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3 h-3" />
                    <span>Скопировать</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div
            className={`rounded-2xl p-4 border ${
              isDarkTheme ? 'bg-[#180f22] border-pink-950/60' : 'bg-white border-pink-100'
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400">
              АКТИВНЫЕ ПРИВИЛЕГИИ
            </span>
            <div className="mt-2 space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">Подарок: СПА-уход за руками</div>
                  <div className="text-[10px] text-slate-400">Выиграно на Колесе Фортуны · Активен</div>
                </div>
                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">Готов к визиту</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">Скидка 15% на сложный арт-дизайн</div>
                  <div className="text-[10px] text-slate-400">Применится автоматически при записи</div>
                </div>
                <span className="text-[10px] font-black uppercase text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-500/20">Купон</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STUDIO LOCATION & CONTACTS (Exact address and phones from user, VK removed) */}
      <div
        id="profile-studio-contacts"
        className={`rounded-3xl p-4 border mt-1 shadow-md ${
          isDarkTheme
            ? 'bg-[#180f22] border-pink-950/60 text-slate-300'
            : 'bg-white border-pink-100 text-slate-700'
        }`}
      >
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-400">
          СТУДИЯ ART XAOC · «НЕЖНАЯ ЖЕСТЬ»
        </span>
        <h4 className="font-serif font-bold text-sm text-pink-200 mt-0.5">
          Контакты и адрес студии
        </h4>
        <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
          Мастер Ангелина принимает одна в студии, гарантируя приватную атмосферу и заботу без спешки.
        </p>

        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2 p-2 rounded-xl bg-black/20 border border-white/5">
            <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-200">ул. Мате Залка, д. 25</div>
              <div className="text-[11px] text-slate-400">вход с торца дома</div>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded-xl bg-black/20 border border-white/5">
            <Phone className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <div className="font-semibold text-slate-200">Телефоны для связи:</div>
              <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-slate-300 mt-0.5">
                <a href="tel:89279973780" className="hover:text-pink-300 transition-colors font-medium">
                  8 (927) 997-37-80
                </a>
                <span>·</span>
                <a href="tel:89806082670" className="hover:text-pink-300 transition-colors font-medium">
                  8 (980) 608-26-70
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <span className="font-medium text-slate-200">Telegram: @Ni_Gelya</span>
            </div>
            <a
              href="https://t.me/Ni_Gelya"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-pink-600/30 hover:bg-pink-600/50 border border-pink-500/40 text-pink-300 text-[11px] font-bold flex items-center gap-1"
            >
              <span>Открыть</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* DISCREET MASTER ACCESS (Never visible as an admin banner or client tab) */}
      <div className="text-center pt-2 pb-1">
        <button
          type="button"
          onClick={() => {
            setShowPinModal(true);
            setPinError(false);
            setPinValue('');
          }}
          className="text-[11px] text-slate-500/40 hover:text-pink-400/80 transition-colors inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
        >
          <Lock className="w-3 h-3 opacity-50" />
          <span>Служебный вход</span>
        </button>
      </div>

      {/* PIN DIALOG FOR ANGELINA ONLY */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-xs rounded-3xl p-5 border text-center animate-in zoom-in-95 duration-200 ${
              isDarkTheme
                ? 'bg-[#1e1029] border-pink-500/40 text-slate-100 shadow-2xl'
                : 'bg-white border-pink-200 text-slate-800 shadow-xl'
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-400">
                Авторизация мастера
              </span>
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-3 text-left">
              Введите мастер-пароль для входа в панель Ангелины:
            </p>

            <form onSubmit={handleVerifyMasterPin} className="space-y-3">
              <input
                type="password"
                value={pinValue}
                onChange={(e) => {
                  setPinValue(e.target.value);
                  setPinError(false);
                }}
                placeholder="Мастер-пароль"
                autoFocus
                className="w-full text-center tracking-wider text-base font-mono py-2.5 rounded-xl bg-black/40 border border-pink-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />

              {pinError && (
                <p className="text-[11px] text-rose-400 font-bold">
                  Неверный пароль доступа
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-400"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white shadow-md"
                >
                  Войти
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
