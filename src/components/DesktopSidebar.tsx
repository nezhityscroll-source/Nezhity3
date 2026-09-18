import React from 'react';
import { Home, Calendar, Sparkles, Trophy, User, Heart, Terminal, MessageCircle, ShieldAlert } from 'lucide-react';
import { TabType } from '../types';

interface DesktopSidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isDarkTheme: boolean;
  points: number;
  tickets: number;
  onConsoleButtonClick: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentTab,
  onSelectTab,
  isDarkTheme,
  points,
  tickets,
  onConsoleButtonClick,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'home',
      label: 'Главная (Дом)',
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'booking',
      label: 'Запись & Прайс',
      icon: <Calendar className="w-4 h-4" />,
      badge: 'Прайс',
    },
    {
      id: 'nezhity',
      label: 'Нежить AI Чат',
      icon: <Sparkles className="w-4 h-4 animate-pulse" />,
    },
    {
      id: 'club',
      label: 'Колесо Фортуны',
      icon: <Trophy className="w-4 h-4" />,
      badge: `${tickets} билета`,
    },
    {
      id: 'profile',
      label: 'Мой профиль & Diary',
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <aside
      id="desktop-sidebar"
      className={`desktop-only-sidebar rounded-3xl p-5 border shadow-xl flex flex-col gap-5 ${
        isDarkTheme
          ? 'bg-[#150e1c]/90 border-pink-900/40 text-slate-100'
          : 'bg-white/95 border-pink-200 text-slate-800'
      }`}
    >
      {/* Studio Header in Sidebar */}
      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 flex items-center justify-center text-white shadow-md font-serif font-black text-sm">
          XAOC
        </div>
        <div className="flex flex-col">
          <span className="font-serif font-bold text-base tracking-tight text-pink-400">
            ART XAOC
          </span>
          <span className="text-[10px] uppercase tracking-widest text-slate-400">
            Студия «Нежная жесть»
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex flex-col gap-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 py-1">
          Навигация
        </span>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`desktop-nav-btn-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md scale-[1.02]'
                  : isDarkTheme
                  ? 'text-slate-300 hover:bg-white/5 hover:text-pink-300'
                  : 'text-slate-600 hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Interactive Mascot Mini Card */}
      <div
        id="sidebar-mascot-widget"
        className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.02] ${
          isDarkTheme
            ? 'bg-[#1e1028] border-pink-500/30'
            : 'bg-pink-50 border-pink-200'
        }`}
        onClick={() => onSelectTab('nezhity')}
      >
        <img
          src="/assets/art-haos-nezhity-transparent-hello.png"
          alt="Нежить"
          referrerPolicy="no-referrer"
          className="w-12 h-14 object-contain filter drop-shadow-[0_2px_8px_rgba(236,72,153,0.5)]"
        />
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-serif font-bold text-xs text-pink-400 truncate">Нежить онлайн</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
            «Красота без шаблонов и компромиссов ♡»
          </span>
        </div>
      </div>

      {/* Required Console Action Button */}
      <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-1">
          Интерактив
        </span>
        <button
          id="btn-console-log-sidebar"
          onClick={onConsoleButtonClick}
          type="button"
          className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-pink-600/20 to-purple-600/20 hover:from-pink-600/30 hover:to-purple-600/30 border border-pink-500/40 text-pink-300 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <Terminal className="w-3.5 h-3.5 text-pink-400" />
          <span>Кнопка в консоль</span>
        </button>
      </div>

      {/* Quick stats footer */}
      <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span>Баланс: <strong className="text-pink-400">{points} ₽</strong></span>
        <span>Попытки: <strong className="text-purple-400">{tickets}</strong></span>
      </div>
    </aside>
  );
};
