/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, ServiceItem, WheelSegment, GallerySet, ActiveBooking, MascotReactionEvent, BookingStatus } from './types';
import { SERVICES_DATA } from './data/servicesData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DesktopSidebar } from './components/DesktopSidebar';
import { HomeScreen } from './components/screens/HomeScreen';
import { BookingScreen } from './components/screens/BookingScreen';
import { ClubWheelScreen } from './components/screens/ClubWheelScreen';
import { NezhityChatScreen } from './components/screens/NezhityChatScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AdminScreen } from './components/screens/AdminScreen';
import { AiBuilderModal } from './components/modals/AiBuilderModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { AppointmentDetailsModal } from './components/modals/AppointmentDetailsModal';

const INITIAL_BOOKING: ActiveBooking = {
  id: 'booking-initial-1',
  service: 'Маникюр с однотонным покрытием',
  master: 'Ангелина',
  date: '16 апр',
  time: '16:00',
  status: 'Запись подтверждена',
  bookingStatus: 'confirmed',
  platform: 'Онлайн-запись',
  price: 1800,
  clientName: 'Ангелина',
  clientPhone: '+7 (927) 997-37-80',
  atmosphere: 'talk',
  gift: '🎁 Подарок: Укрепление + Спа-парафин (включены в визит, 0 ₽)',
  targetTimestamp: Date.now() + (3 * 3600 + 42 * 60 + 15) * 1000,
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [points, setPoints] = useState(2450);
  const [tickets, setTickets] = useState(4);
  const [careDays, setCareDays] = useState(3);
  const [cuticleApplied, setCuticleApplied] = useState(false);
  const [userAvatar, setUserAvatar] = useState('/assets/art-haos-nezhity-transparent-hello.png');
  const [activeBooking, setActiveBooking] = useState<ActiveBooking | null>(INITIAL_BOOKING);
  const [allBookings, setAllBookings] = useState<ActiveBooking[]>([INITIAL_BOOKING]);

  // Default pre-selected service matching Image 11
  const [selectedService, setSelectedService] = useState<ServiceItem>(SERVICES_DATA[0]);

  // Modals state
  const [isAiBuilderOpen, setIsAiBuilderOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);

  // Mascot header live reaction state
  const [mascotReaction, setMascotReaction] = useState<MascotReactionEvent | null>(null);

  const triggerMascotReaction = (
    type: 'points' | 'quest' | 'streak' | 'cheer',
    label: string,
    amount?: number
  ) => {
    setMascotReaction({
      id: `mascot-react-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      amount,
      label,
      timestamp: Date.now(),
    });
  };

  const handleToggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  const handleToggleCuticleCare = () => {
    setCuticleApplied((prev) => {
      const nextState = !prev;
      if (nextState) {
        setCareDays((d) => Math.min(7, d + 1));
        setPoints((p) => p + 50);
        triggerMascotReaction(
          'streak',
          'Стрик заботы продлен! Масло нанесено, +50 баллов в копилку! 💖💅',
          50
        );
      } else {
        setCareDays((d) => Math.max(0, d - 1));
      }
      return nextState;
    });
  };

  const handleConsumeTicket = (): boolean => {
    if (tickets <= 0) return false;
    setTickets((t) => Math.max(0, t - 1));
    return true;
  };

  const handleAddTicket = () => {
    setTickets((t) => t + 1);
  };

  const handleAwardPrize = (segment: WheelSegment) => {
    if (typeof segment.value === 'number') {
      setPoints((p) => p + segment.value);
      triggerMascotReaction(
        'points',
        `Колесо фортуны: выпало ${segment.label}! Баллы начислены! 💎✨`,
        segment.value
      );
    } else {
      triggerMascotReaction(
        'quest',
        `Колесо фортуны: твой выигрыш — ${segment.label}! Нежить празднует! 🎉🖤`
      );
    }
  };

  const handleSelectSetToBook = (set: GallerySet) => {
    const customService: ServiceItem = {
      id: `set-book-${set.id}`,
      category: 'combos',
      name: `Сет: ${set.title}`,
      badge: 'Atelier Set',
      badgeType: 'art',
      duration: '110 мин',
      price: set.price,
      description: set.description,
      featureText: 'Фирменный арт',
      featureIcon: 'palette',
    };
    setSelectedService(customService);
    setCurrentTab('booking');
  };

  const handleApplyCustomBuild = (customService: ServiceItem) => {
    setSelectedService(customService);
    setCurrentTab('booking');
  };

  // Required Interactive Action: Output "Кнопка нажата!" to the browser console
  const handleConsoleButtonClick = () => {
    console.log('Кнопка нажата!');
    setPoints((p) => p + 50);
    triggerMascotReaction(
      'points',
      'Консольная магия активирована: «Кнопка нажата!» Нежить дарит +50 баллов! 🦇✨',
      50
    );
  };

  const handleUpdateBookingStatus = (id: string, newStatus: BookingStatus, reason?: string) => {
    setAllBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            bookingStatus: newStatus,
            status:
              newStatus === 'confirmed'
                ? 'Запись подтверждена'
                : newStatus === 'completed'
                ? 'Визит завершен'
                : newStatus === 'cancelled'
                ? 'Запись отменена'
                : 'Ожидает решения',
            cancellationReason: reason,
          };
        }
        return b;
      })
    );

    // If it was the active booking, reflect the change
    if (activeBooking && activeBooking.id === id) {
      if (newStatus === 'cancelled') {
        setActiveBooking(null);
      } else {
        setActiveBooking((prev) =>
          prev
            ? {
                ...prev,
                bookingStatus: newStatus,
                status:
                  newStatus === 'confirmed'
                    ? 'Запись подтверждена'
                    : newStatus === 'completed'
                    ? 'Визит завершен'
                    : 'Ожидает решения',
              }
            : null
        );
      }
    }

    if (newStatus === 'completed') {
      handleAddTicket();
      triggerMascotReaction(
        'quest',
        'Визит успешно завершен! Клиенту начислен +1 билет на Колесо Фортуны! 💅🎟️'
      );
    }
  };

  const handleIssueTicketToClient = (_phone?: string) => {
    handleAddTicket();
    triggerMascotReaction(
      'quest',
      'Бонусный билет выдан! Нежить добавила попытку в клуб! 🎟️✨'
    );
  };

  return (
    <div
      id="art-xaoc-root"
      className={`min-h-screen transition-colors duration-300 ${
        isDarkTheme
          ? 'bg-[#121116] text-[#e8e7ed]'
          : 'bg-[#fcf8fc] text-[#1c1a20]'
      }`}
    >
      {/* Background ambient lighting - Soft rose and warm cream */}
      <div
        className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${
          isDarkTheme ? 'opacity-60' : 'opacity-40'
        }`}
      >
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 blur-3xl ${
            isDarkTheme
              ? 'bg-gradient-to-b from-stone-800/15 via-zinc-900/10 to-transparent'
              : 'bg-gradient-to-b from-pink-200/30 via-purple-100/20 to-transparent'
          }`}
        />
      </div>

      {/* Header bar with Mascot live reactions */}
      <Header
        points={points}
        tickets={tickets}
        isDarkTheme={isDarkTheme}
        onToggleTheme={handleToggleTheme}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setCurrentTab('profile')}
        userAvatar={userAvatar}
        activeBooking={activeBooking}
        onOpenBookingDetails={() => setIsBookingDetailsOpen(true)}
        mascotReaction={mascotReaction}
        onClearMascotReaction={() => setMascotReaction(null)}
      />

      {/* Main Adaptive Container with CSS Media Queries (.app-container-adaptive & .desktop-split-layout) */}
      <main
        className={`app-container-adaptive ${
          activeBooking ? 'pt-26 sm:pt-28' : 'pt-20'
        } pb-12 relative z-10`}
      >
        <div className="desktop-split-layout">
          {/* Desktop Adaptive Sidebar (shown on @media min-width: 1024px) */}
          <DesktopSidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            isDarkTheme={isDarkTheme}
            points={points}
            tickets={tickets}
            onConsoleButtonClick={handleConsoleButtonClick}
          />

          {/* Active Screen View */}
          <div className="flex-1 min-w-0">
            {currentTab === 'home' && (
              <HomeScreen
                isDarkTheme={isDarkTheme}
                onNavigate={setCurrentTab}
                onOpenAiBuilder={() => setIsAiBuilderOpen(true)}
                onSelectSetToBook={handleSelectSetToBook}
                cuticleApplied={cuticleApplied}
                onToggleCuticleCare={handleToggleCuticleCare}
                careDays={careDays}
                tickets={tickets}
                onConsoleButtonClick={handleConsoleButtonClick}
                activeBooking={activeBooking}
                onOpenBookingDetails={() => setIsBookingDetailsOpen(true)}
                userAvatar={userAvatar}
                onSelectMascotLook={setUserAvatar}
              />
            )}

            {currentTab === 'booking' && (
              <BookingScreen
                isDarkTheme={isDarkTheme}
                selectedService={selectedService}
                onSelectService={setSelectedService}
                onBookingConfirmed={({
                  service,
                  date,
                  time,
                  master,
                  clientName,
                  clientPhone,
                  atmosphere,
                  comments,
                  referralCode,
                }) => {
                  const [hoursStr, minsStr] = (time || '16:00').split(':');
                  const hours = parseInt(hoursStr, 10) || 16;
                  const mins = parseInt(minsStr, 10) || 0;

                  const target = new Date();
                  target.setHours(hours, mins, 0, 0);
                  if (target.getTime() <= Date.now()) {
                    target.setDate(target.getDate() + 1);
                  }

                  const newBooking: ActiveBooking = {
                    id: `booking-${Date.now()}`,
                    service: service.name,
                    master: master || 'Ангелина',
                    date: date,
                    time: time,
                    status: 'Заявка отправлена (ожидает подтверждения)',
                    bookingStatus: 'pending',
                    platform: 'Онлайн-запись',
                    price: service.price,
                    gift: '🎁 Подарок: Укрепление + Спа-парафин (включены в визит, 0 ₽)',
                    clientName: clientName || 'Гость',
                    clientPhone: clientPhone || '+7 (927) 997-37-80',
                    atmosphere: atmosphere || 'talk',
                    comments: comments || undefined,
                    referralCode: referralCode || undefined,
                    targetTimestamp: target.getTime(),
                  };

                  setActiveBooking(newBooking);
                  setAllBookings((prev) => [newBooking, ...prev]);

                  triggerMascotReaction(
                    'quest',
                    `Заявка на «${service.name}» оформлена! Ангелина подтвердит окно в WhatsApp ♡`
                  );
                }}
              />
            )}

            {currentTab === 'club' && (
              <ClubWheelScreen
                isDarkTheme={isDarkTheme}
                points={points}
                tickets={tickets}
                onAwardPrize={handleAwardPrize}
                onConsumeTicket={handleConsumeTicket}
                onAddTicket={handleAddTicket}
                onQuestCompleted={(questName, pointsAmount) => {
                  if (pointsAmount) {
                    setPoints((p) => p + pointsAmount);
                  }
                  triggerMascotReaction(
                    'quest',
                    `Задание «${questName}» выполнено! Нежить рада твоей активности! 🎟️✨`,
                    pointsAmount
                  );
                }}
              />
            )}

            {currentTab === 'nezhity' && (
              <NezhityChatScreen
                isDarkTheme={isDarkTheme}
                onNavigate={setCurrentTab}
                onOpenAiBuilder={() => setIsAiBuilderOpen(true)}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileScreen
                isDarkTheme={isDarkTheme}
                points={points}
                tickets={tickets}
                careDays={careDays}
                cuticleApplied={cuticleApplied}
                onToggleCuticleCare={handleToggleCuticleCare}
                onSelectSetToBook={handleSelectSetToBook}
                userAvatar={userAvatar}
                onUpdateAvatar={setUserAvatar}
                onNavigateToAdmin={() => setCurrentTab('admin')}
              />
            )}

            {currentTab === 'admin' && (
              <AdminScreen
                isDarkTheme={isDarkTheme}
                bookings={allBookings}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onIssueTicketToClient={handleIssueTicketToClient}
                onClose={() => setCurrentTab('home')}
              />
            )}
          </div>
        </div>
      </main>

      {/* Mobile & Tablet Bottom Navigation (hidden on desktop via .mobile-bottom-nav media query) */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isDarkTheme={isDarkTheme}
      />

      {/* AI Builder Modal */}
      <AiBuilderModal
        isOpen={isAiBuilderOpen}
        onClose={() => setIsAiBuilderOpen(false)}
        isDarkTheme={isDarkTheme}
        onApplyCustomSet={handleApplyCustomBuild}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        isDarkTheme={isDarkTheme}
        onOpenBooking={() => setCurrentTab('booking')}
        onOpenClub={() => setCurrentTab('club')}
      />

      {/* Appointment Details & Live Countdown Modal */}
      <AppointmentDetailsModal
        isOpen={isBookingDetailsOpen}
        onClose={() => setIsBookingDetailsOpen(false)}
        booking={activeBooking}
        isDarkTheme={isDarkTheme}
        onReschedule={() => {
          setIsBookingDetailsOpen(false);
          setCurrentTab('booking');
        }}
        onCancelBooking={() => {
          setActiveBooking(null);
        }}
      />
    </div>
  );
}
