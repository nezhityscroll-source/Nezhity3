import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Brush,
  Footprints,
  Gift,
  Calendar as CalendarIcon,
  CheckCircle2,
  ArrowRight,
  Palette,
  Diamond,
  Zap,
  Phone,
  User,
  MessageCircle,
  Copy,
  ExternalLink,
  Tv,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ServiceItem, VisitAtmosphere } from '../../types';
import { SERVICES_DATA } from '../../data/servicesData';

interface BookingScreenProps {
  isDarkTheme: boolean;
  selectedService: ServiceItem;
  onSelectService: (service: ServiceItem) => void;
  onBookingConfirmed: (details: {
    service: ServiceItem;
    date: string;
    time: string;
    master: string;
    clientName?: string;
    clientPhone?: string;
    atmosphere?: VisitAtmosphere;
    comments?: string;
    referralCode?: string;
  }) => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({
  isDarkTheme,
  selectedService,
  onSelectService,
  onBookingConfirmed,
}) => {
  const [activeCategory, setActiveCategory] = useState<'manicure' | 'pedicure' | 'combos'>('manicure');
  const [selectedDate, setSelectedDate] = useState('16 апр');
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+7 (927) ');
  const [atmosphere, setAtmosphere] = useState<VisitAtmosphere>('talk');
  const [comments, setComments] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const dates = [
    { dayOfWeek: 'СР', num: '16', full: '16 апр' },
    { dayOfWeek: 'ЧТ', num: '17', full: '17 апр' },
    { dayOfWeek: 'ПТ', num: '18', full: '18 апр' },
    { dayOfWeek: 'СБ', num: '19', full: '19 апр' },
    { dayOfWeek: 'ВС', num: '20', full: '20 апр' },
  ];

  // Preferred slots requested by user
  const timeSlots = ['10:00', '11:30', '13:00', '14:30', '16:00', '18:30'];

  const filteredServices = SERVICES_DATA.filter((s) => s.category === activeCategory);

  const getAtmosphereTitle = (atm: VisitAtmosphere) => {
    switch (atm) {
      case 'talk':
        return 'Поговорить';
      case 'series':
        return 'Смотреть сериал';
      case 'silence':
        return 'Предпочитаю тишину';
    }
  };

  const generateBookingMessage = () => {
    const atmText = getAtmosphereTitle(atmosphere);
    return `Привет, Ангелина! Хочу записаться в ART XAOC:
💅 Услуга: ${selectedService.name} (${selectedService.price} ₽)
📅 Предпочтительное время: ${selectedDate} в ${selectedTime}
👤 Имя: ${clientName.trim() || 'Гость'}
📞 Телефон: ${clientPhone.trim()}
☕ Атмосфера: ${atmText}${comments ? `\n💬 Пожелания: ${comments}` : ''}${referralCode ? `\n🎟️ Код друга: ${referralCode}` : ''}
🎁 Подарок студии: Укрепление + Спа-парафин (укрепление акригелем, снятие, горячий парафин — 0 ₽)`;
  };

  const handleBookRitual = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#db2777', '#f43f5e', '#a855f7', '#fb7185'],
      });
    } catch {
      // fallback
    }

    setShowSuccessModal(true);
    onBookingConfirmed({
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      master: 'Ангелина',
      clientName: clientName.trim() || 'Гость',
      clientPhone: clientPhone.trim(),
      atmosphere,
      comments: comments.trim(),
      referralCode: referralCode.trim(),
    });
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(generateBookingMessage());
    window.open(`https://wa.me/79279973780?text=${text}`, '_blank');
  };

  const handleCopyMessage = () => {
    navigator.clipboard?.writeText(generateBookingMessage());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div id="screen-booking" className="flex flex-col gap-5 pb-36 animate-in fade-in duration-300">
      {/* HERO CARD with Nezhity Mascot holding Прайс Book */}
      <div
        id="booking-hero-card"
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border transition-all duration-300 ${
          isDarkTheme
            ? 'bg-gradient-to-br from-[#25162b] via-[#1b0d21] to-[#200924] border-pink-900/40 text-slate-100 shadow-[0_12px_40px_rgba(219,39,119,0.2)]'
            : 'bg-[#25162b] text-white border-pink-900 shadow-xl'
        }`}
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-pink-600 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-purple-600 rounded-full blur-2xl opacity-20 pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-pink-200">
                НЕЖИТЬ · ONLINE
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Запись <span className="italic font-normal text-pink-300">♡</span> Прайс
            </h1>
            <p className="font-serif italic text-sm text-pink-200/90 leading-snug">
              Честные цены и ручное подтверждение окон
            </p>
          </div>

          <div className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28">
            <img
              src="/assets/nezhity-price-book.png?v=2"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('art-haos-nezhity-transparent-hello.png')) {
                  target.src = '/assets/art-haos-nezhity-transparent-hello.png';
                }
              }}
              alt="Нежить держит Прайс"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(218,34,128,0.45)] hover:scale-105 transition-transform"
            />
            <div className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-pink-600 text-white text-[10px] font-bold shadow-md tracking-wider">
              Прайс ♡
            </div>
          </div>
        </div>

        {/* Nezhity Quote Speech Box */}
        <div className="relative z-10 mt-3.5 rounded-xl bg-white/10 backdrop-blur-md p-3 flex items-start gap-2 border border-white/10 shadow-inner">
          <Heart className="w-4 h-4 text-pink-300 flex-shrink-0 mt-0.5 fill-pink-400" />
          <p className="text-xs text-pink-100 leading-snug">
            «Честные цены студии без скрытых доплат. Укрепление акригелем, снятие, горячий парафин — всегда включены автоматически в каждый визит! ♡»
          </p>
        </div>

        {/* Gift Callout Pill */}
        <div className="relative z-10 mt-2.5 flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white px-3 py-1.5 shadow-md">
          <Gift className="w-4 h-4 flex-shrink-0 animate-bounce text-pink-200" />
          <span className="text-[11px] font-bold truncate">
            Подарок студии: Укрепление + Спа-парафин
          </span>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div
        id="category-tabs-container"
        className={`flex items-center gap-1 p-1 rounded-full border transition-colors ${
          isDarkTheme ? 'bg-[#180f22] border-pink-950/60 shadow-sm' : 'bg-pink-50/70 border-pink-200'
        }`}
      >
        <button
          id="tab-service-manicure"
          onClick={() => setActiveCategory('manicure')}
          type="button"
          className={`flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 ${
            activeCategory === 'manicure'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
              : isDarkTheme
              ? 'text-slate-400 hover:text-pink-300'
              : 'text-slate-600 hover:text-pink-600'
          }`}
        >
          <Brush className="w-3.5 h-3.5" />
          <span>Маникюр</span>
        </button>

        <button
          id="tab-service-pedicure"
          onClick={() => setActiveCategory('pedicure')}
          type="button"
          className={`flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 ${
            activeCategory === 'pedicure'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
              : isDarkTheme
              ? 'text-slate-400 hover:text-pink-300'
              : 'text-slate-600 hover:text-pink-600'
          }`}
        >
          <Footprints className="w-3.5 h-3.5" />
          <span>Педикюр</span>
        </button>

        <button
          id="tab-service-combos"
          onClick={() => setActiveCategory('combos')}
          type="button"
          className={`flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 ${
            activeCategory === 'combos'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
              : isDarkTheme
              ? 'text-slate-400 hover:text-pink-300'
              : 'text-slate-600 hover:text-pink-600'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Сеты</span>
        </button>
      </div>

      {/* SERVICES LIST */}
      <div id="services-cards-list" className="flex flex-col gap-3">
        {filteredServices.map((service) => {
          const isSelected = selectedService.id === service.id;

          return (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              onClick={() => onSelectService(service)}
              className={`relative overflow-hidden rounded-2xl p-4 border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-pink-500 ring-2 ring-pink-500/50 shadow-[0_8px_25px_rgba(219,39,119,0.25)]'
                  : isDarkTheme
                  ? 'bg-[#180f22] border-pink-950/60 hover:border-pink-900/60'
                  : 'bg-white border-pink-100 hover:border-pink-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif font-bold text-base text-slate-100">
                      {service.name}
                    </h3>
                    {service.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-300">
                    <span className="text-slate-400">⏱️ {service.duration}</span>
                    {service.featureText && (
                      <span className="text-pink-400 font-medium">✦ {service.featureText}</span>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-serif font-bold text-lg sm:text-xl text-pink-400">
                    {service.pricePrefix || ''}
                    {service.price.toLocaleString('ru-RU')} ₽
                  </div>
                  <div
                    className={`mt-2 w-6 h-6 rounded-full border flex items-center justify-center ml-auto transition-colors ${
                      isSelected
                        ? 'bg-pink-600 border-pink-500 text-white'
                        : 'border-white/20 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* STUDIO GIFT CALLOUT (Strictly from specification) */}
      <div
        id="card-studio-gift"
        className={`relative overflow-hidden rounded-2xl p-4 border shadow-lg ${
          isDarkTheme
            ? 'bg-gradient-to-r from-[#200e26] via-[#1a0b20] to-[#250d2b] border-pink-900/50 text-slate-100'
            : 'bg-[#25162b] text-white border-pink-900'
        }`}
      >
        <div className="relative z-10 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Gift className="w-5 h-5 animate-pulse" />
          </div>

          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-300">
              Подарок студии к записи
            </span>
            <h4 className="font-serif font-bold text-base text-white">
              Укрепление + Спа-парафин
            </h4>
            <p className="text-xs text-pink-100/90 leading-relaxed mt-0.5">
              Укрепление акригелем, снятие, горячий парафин. Включены автоматически в каждый визит.
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-pink-300">0 ₽</span>
              <span className="text-xs text-slate-400 line-through">800 ₽</span>
              <span className="text-[10px] font-bold text-emerald-400 ml-1">Включено</span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 2: PREFERRED DATE & TIME */}
      <div
        id="box-slot-picker"
        className={`flex flex-col gap-3 rounded-2xl p-4 border transition-all ${
          isDarkTheme ? 'bg-[#180f22] border-pink-950/60 text-slate-100 shadow-sm' : 'bg-white border-pink-100 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm sm:text-base flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-pink-500" />
            <span>Предпочтительное время</span>
          </h3>
          <span className="text-[11px] font-bold uppercase tracking-wider text-pink-400">
            Апрель 2025
          </span>
        </div>

        {/* Master Info Chip */}
        <div
          className={`flex items-center justify-between p-2.5 rounded-xl border ${
            isDarkTheme ? 'bg-black/20 border-white/5' : 'bg-pink-50/60 border-pink-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 font-bold overflow-hidden">
              <img
                src="/assets/art-haos-nezhity-transparent-hello.png"
                alt="Ангелина"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold">Мастер Ангелина</span>
              <span className="text-[10px] text-pink-400 font-medium">
                Принимаю одна в уютной студии без лишней суеты ♡
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[10px] font-extrabold border border-pink-500/20">
            ★ 5.0 (340+)
          </span>
        </div>

        {/* Week Days Picker */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {dates.map((d) => {
            const isDaySelected = selectedDate === d.full;
            return (
              <button
                key={d.num}
                id={`date-slot-${d.num}`}
                onClick={() => setSelectedDate(d.full)}
                type="button"
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl font-bold transition-all duration-150 ${
                  isDaySelected
                    ? 'bg-gradient-to-t from-pink-600 to-rose-600 text-white shadow-md'
                    : isDarkTheme
                    ? 'bg-white/5 text-slate-300 hover:bg-white/10'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="text-[10px] opacity-80 uppercase">{d.dayOfWeek}</span>
                <span className="text-base font-serif font-bold">{d.num}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    isDaySelected ? 'bg-white' : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Time Slots Grid (6 slots: 10:00, 11:30, 13:00, 14:30, 16:00, 18:30) */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
          {timeSlots.map((time) => {
            const isTimeSelected = selectedTime === time;
            return (
              <button
                key={time}
                id={`time-slot-${time.replace(':', '')}`}
                onClick={() => setSelectedTime(time)}
                type="button"
                className={`min-h-[42px] flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                  isTimeSelected
                    ? 'bg-pink-600 text-white shadow-md'
                    : isDarkTheme
                    ? 'bg-white/5 text-slate-300 hover:bg-white/10'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>

        {/* Explanatory note explicitly as requested */}
        <p className="text-[11px] text-pink-300/90 italic text-center px-2 py-1 rounded-lg bg-pink-950/30 border border-pink-500/20">
          «Время предварительное, окно закрывается Ангелиной лично».
        </p>
      </div>

      {/* STEP 3: CONTACTS & VISIT ATMOSPHERE */}
      <div
        id="box-booking-contacts"
        className={`flex flex-col gap-3 rounded-2xl p-4 border transition-all ${
          isDarkTheme ? 'bg-[#180f22] border-pink-950/60 text-slate-100 shadow-sm' : 'bg-white border-pink-100 text-slate-800'
        }`}
      >
        <h3 className="font-serif font-bold text-sm sm:text-base flex items-center gap-1.5 text-pink-300">
          <User className="w-4 h-4 text-pink-500" />
          <span>Контакты и атмосфера визита</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Твоё имя *
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Как к тебе обращаться?"
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-pink-500/30 text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Номер телефона *
            </label>
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="+7 (927) ..."
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-pink-500/30 text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Atmosphere selector (talk, series, silence) */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
            Атмосфера процедуры:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setAtmosphere('talk')}
              className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                atmosphere === 'talk'
                  ? 'bg-pink-600/30 border-pink-500 text-pink-200'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Поговорить</span>
            </button>

            <button
              type="button"
              onClick={() => setAtmosphere('series')}
              className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                atmosphere === 'series'
                  ? 'bg-pink-600/30 border-pink-500 text-pink-200'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Сериал</span>
            </button>

            <button
              type="button"
              onClick={() => setAtmosphere('silence')}
              className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                atmosphere === 'silence'
                  ? 'bg-pink-600/30 border-pink-500 text-pink-200'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>В тишине</span>
            </button>
          </div>
        </div>

        {/* Comments & Referral */}
        <div className="space-y-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Пожелания или вопрос (форма, дизайн, длина):
            </label>
            <input
              type="text"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Например: хочу готические сердца или чёрный микро-френч"
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Код друга (если есть):
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="FRIEND-XAOC10"
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-white focus:outline-none focus:border-pink-500 uppercase"
            />
          </div>
        </div>
      </div>

      {/* FLOATING BOOKING CONFIRMATION BAR */}
      <div
        id="floating-booking-bar"
        className="fixed bottom-[74px] inset-x-0 z-40 max-w-md mx-auto px-3 pointer-events-auto"
      >
        <div
          className={`p-3.5 rounded-2xl backdrop-blur-2xl border shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex flex-col gap-2.5 ${
            isDarkTheme
              ? 'bg-[#150e1c]/95 border-pink-500/40 text-slate-100'
              : 'bg-white/95 border-pink-200 text-slate-900 shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Выбранный ритуал:
              </span>
              <span className="font-serif font-bold text-xs sm:text-sm truncate">
                {selectedService.name}
              </span>
              <span className="text-[11px] text-pink-400 font-semibold truncate">
                {selectedDate} в {selectedTime} · Ангелина
              </span>
            </div>

            <div className="flex flex-col items-end flex-shrink-0">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Итого
              </span>
              <span className="font-serif font-bold text-base sm:text-lg text-pink-500">
                {selectedService.pricePrefix || ''}
                {selectedService.price.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>

          <button
            id="btn-confirm-ritual-booking"
            onClick={handleBookRitual}
            type="button"
            className="w-full min-h-[46px] rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(219,39,119,0.4)] active:scale-[0.98] transition-transform hover:brightness-110"
          >
            <span>Отправить заявку Ангелине</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION MODAL WITH WHATSAPP & TELEGRAM HANDOFF */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-3xl p-6 border text-center animate-in zoom-in-95 duration-200 ${
              isDarkTheme
                ? 'bg-[#1b0e25] border-pink-500/50 text-slate-100 shadow-[0_0_50px_rgba(219,39,119,0.3)]'
                : 'bg-white border-pink-200 text-slate-800 shadow-2xl'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto mb-3 ring-4 ring-pink-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="font-serif font-bold text-xl text-pink-400">
              Заявка отправлена!
            </h3>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Ангелина подтвердит точное окно лично. Нажми кнопку ниже, чтобы сразу открыть диалог в WhatsApp или Telegram с готовыми данными.
            </p>

            <div className="mt-4 p-3 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-1.5">
              <p><strong>Услуга:</strong> {selectedService.name}</p>
              <p><strong>Время:</strong> {selectedDate} в {selectedTime}</p>
              <p><strong>Клиент:</strong> {clientName || 'Гость'} ({clientPhone})</p>
              <p><strong>Атмосфера:</strong> {getAtmosphereTitle(atmosphere)}</p>
              <p className="text-pink-400 font-semibold">
                🎁 Подарок студии: Укрепление + Спа-парафин (укрепление акригелем, снятие, горячий парафин — 0 ₽)
              </p>
            </div>

            {/* Handshake actions */}
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={handleOpenWhatsApp}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Открыть WhatsApp с готовой заявкой</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://t.me/Ni_Gelya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 rounded-xl bg-[#229ED9]/20 hover:bg-[#229ED9]/30 border border-[#229ED9]/40 text-[#229ED9] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Telegram @Ni_Gelya</span>
                </a>

                <button
                  onClick={handleCopyMessage}
                  className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedText ? 'Скопировано!' : 'Скопировать текст'}</span>
                </button>
              </div>
            </div>

            <button
              id="btn-close-success-modal"
              onClick={() => setShowSuccessModal(false)}
              className="mt-4 text-xs text-slate-400 hover:text-white font-medium underline"
            >
              Закрыть окно
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
