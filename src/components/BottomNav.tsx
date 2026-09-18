import React from 'react';
import { Home, Calendar, Sparkles, Ticket, User } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isDarkTheme: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  isDarkTheme,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Дом',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'booking',
      label: 'Запись',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'nezhity',
      label: 'Нежить',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'club',
      label: 'Клуб',
      icon: <Ticket className="w-5 h-5" />,
    },
    {
      id: 'profile',
      label: 'Я',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="mobile-bottom-nav fixed bottom-0 inset-x-0 z-50 pointer-events-none pb-[calc(env(safe-area-inset-bottom,0px)+10px)]"
    >
      <div className="max-w-md mx-auto px-4 pointer-events-auto">
        {/* Soft pink handle line above nav bar as seen in screenshot */}
        <div className="w-10 h-1 bg-[#ffb3c9]/80 rounded-full mx-auto mb-2" />

        <div
          className={`flex items-center justify-around py-1.5 px-2 rounded-[32px] backdrop-blur-2xl transition-all duration-300 relative ${
            isDarkTheme
              ? 'bg-[#18171d]/95 border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.7)]'
              : 'bg-white/95 border border-white/80 shadow-[0_10px_35px_rgba(244,93,139,0.14)]'
          }`}
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                type="button"
                className={`relative flex flex-col items-center justify-center min-w-[58px] py-1.5 px-3 rounded-2xl transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'text-[#e83269] font-bold'
                    : isDarkTheme
                    ? 'text-stone-400 hover:text-stone-200'
                    : 'text-[#8c8299] hover:text-[#1a102a]'
                }`}
              >
                {/* Active Light Pink Rounded Pill */}
                {isActive && (
                  <span
                    className={`absolute inset-0 rounded-2xl -z-10 transition-all duration-300 ${
                      isDarkTheme
                        ? 'bg-white/10 border border-white/15 shadow-xs'
                        : 'bg-[#ffe6ee] border border-pink-100/60'
                    }`}
                  />
                )}

                <div className="relative transform transition-transform duration-200">
                  {item.icon}
                </div>
                <span className="text-[11px] mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

