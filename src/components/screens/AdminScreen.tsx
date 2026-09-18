import React, { useState } from 'react';
import {
  ShieldAlert,
  Calendar,
  Phone,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  User,
  Sparkles,
  KeyRound,
  ExternalLink,
  Gift,
  RefreshCw,
} from 'lucide-react';
import { ActiveBooking, BookingStatus, VisitAtmosphere } from '../../types';

interface AdminScreenProps {
  isDarkTheme: boolean;
  bookings: ActiveBooking[];
  onUpdateBookingStatus: (id: string, newStatus: BookingStatus, reason?: string) => void;
  onIssueTicketToClient: (phone?: string) => void;
  onClose?: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  isDarkTheme,
  bookings,
  onUpdateBookingStatus,
  onIssueTicketToClient,
  onClose,
}) => {
  // WhatsApp OTP Code Issuance state
  const [clientPhoneInput, setClientPhoneInput] = useState('+7 (927) 997-37-80');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpExpiresAt, setOtpExpiresAt] = useState<string | null>(null);

  // Status Filter
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all');
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancelReasonInput, setCancelReasonInput] = useState('');

  // Status counts
  const pendingCount = bookings.filter((b) => (b.bookingStatus || 'confirmed') === 'pending').length;
  const confirmedCount = bookings.filter((b) => (b.bookingStatus || 'confirmed') === 'confirmed').length;
  const completedCount = bookings.filter((b) => b.bookingStatus === 'completed').length;
  const cancelledCount = bookings.filter((b) => b.bookingStatus === 'cancelled').length;

  const filteredBookings = bookings.filter((b) => {
    const currentStatus = b.bookingStatus || 'confirmed';
    if (filterStatus === 'all') return true;
    return currentStatus === filterStatus;
  });

  const handleGenerateOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    const expires = new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setOtpExpiresAt(expires);
  };

  const getAtmosphereLabel = (atmosphere?: VisitAtmosphere) => {
    switch (atmosphere) {
      case 'talk':
        return '🗣️ Поговорить';
      case 'series':
        return '🎬 Смотреть сериал';
      case 'silence':
        return '🤫 В тишине';
      default:
        return '💅 По настроению';
    }
  };

  const handleOpenClientWhatsApp = (phone?: string, text?: string) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(text || 'Здравствуйте! Это Ангелина из ART XAOC.');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div id="screen-admin" className="flex flex-col gap-4 pb-32 animate-in fade-in duration-300">
      {/* HEADER BANNER */}
      <div
        id="admin-header-card"
        className={`relative overflow-hidden rounded-3xl p-4 sm:p-5 border shadow-xl ${
          isDarkTheme
            ? 'bg-gradient-to-br from-[#23122e] via-[#170923] to-[#250d30] border-pink-900/50 text-slate-100'
            : 'bg-[#25162b] text-white border-pink-900'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-extrabold uppercase tracking-widest border border-pink-500/30">
              <ShieldAlert className="w-3 h-3 text-pink-400" />
              <span>Панель мастера · Ангелина</span>
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-white mt-1.5">
              Управление записями
            </h1>
            <p className="text-xs text-pink-200/90 mt-0.5">
              Ручное подтверждение окон, статус визитов и выдача WhatsApp-кодов
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
              >
                ← В студию
              </button>
            )}
            <div className="w-10 h-10 rounded-2xl overflow-hidden ring-2 ring-pink-500 shadow-md flex-shrink-0 bg-black/40">
              <img
                src="/assets/art-haos-nezhity-transparent-hello.png"
                alt="Маскот"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* STATUS METRICS GRID */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center border transition-all ${
              filterStatus === 'pending'
                ? 'bg-amber-500/30 border-amber-400 text-amber-200'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider">Ожидают</span>
            <span className="font-serif font-bold text-lg sm:text-xl text-amber-400">{pendingCount}</span>
          </button>

          <button
            onClick={() => setFilterStatus('confirmed')}
            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center border transition-all ${
              filterStatus === 'confirmed'
                ? 'bg-pink-500/30 border-pink-400 text-pink-200'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider">Подтвержд.</span>
            <span className="font-serif font-bold text-lg sm:text-xl text-pink-400">{confirmedCount}</span>
          </button>

          <button
            onClick={() => setFilterStatus('completed')}
            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center border transition-all ${
              filterStatus === 'completed'
                ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider">Завершены</span>
            <span className="font-serif font-bold text-lg sm:text-xl text-emerald-400">{completedCount}</span>
          </button>

          <button
            onClick={() => setFilterStatus('cancelled')}
            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center border transition-all ${
              filterStatus === 'cancelled'
                ? 'bg-rose-500/30 border-rose-400 text-rose-200'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider">Отменены</span>
            <span className="font-serif font-bold text-lg sm:text-xl text-rose-400">{cancelledCount}</span>
          </button>
        </div>
      </div>

      {/* WHATSAPP CODE ISSUANCE SECTION */}
      <div
        id="admin-otp-issuance-box"
        className={`rounded-3xl p-4 border shadow-md ${
          isDarkTheme ? 'bg-[#180f24] border-pink-950/70 text-slate-200' : 'bg-white border-pink-200 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <KeyRound className="w-4 h-4 text-pink-400 flex-shrink-0" />
          <h3 className="font-serif font-bold text-sm text-pink-300">
            Выдать WhatsApp-код клиенту
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          По регламенту ART XAOC, клиенты входят по одноразовому коду, который генерирует и отправляет Ангелина.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={clientPhoneInput}
              onChange={(e) => setClientPhoneInput(e.target.value)}
              placeholder="+7 (927) 997-37-80"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-pink-500/30 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
            />
          </div>
          <button
            onClick={handleGenerateOtp}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Сгенерировать код</span>
          </button>
        </div>

        {generatedOtp && (
          <div className="mt-3 p-3 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Сгенерированный OTP:</div>
              <div className="text-2xl font-mono font-bold tracking-widest text-pink-400">{generatedOtp}</div>
              <div className="text-[10px] text-pink-300/80">Действителен до {otpExpiresAt} (10 минут)</div>
            </div>

            <button
              onClick={() => {
                const message = `Привет! Твой код для входа в личный кабинет ART XAOC: ${generatedOtp}. Действует 10 минут.`;
                handleOpenClientWhatsApp(clientPhoneInput, message);
              }}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Открыть WhatsApp с кодом</span>
            </button>
          </div>
        )}
      </div>

      {/* BOOKINGS QUEUE */}
      <div className="flex items-center justify-between mt-1 px-1">
        <h2 className="font-serif font-bold text-base text-pink-300 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-pink-400" />
          <span>Очередь заявок ({filteredBookings.length})</span>
        </h2>
        {filterStatus !== 'all' && (
          <button
            onClick={() => setFilterStatus('all')}
            className="text-xs text-pink-400 hover:underline font-semibold"
          >
            Показать все
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {filteredBookings.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-pink-500/30 text-center text-slate-400 text-xs">
            Заявок с выбранным статусом пока нет.
          </div>
        ) : (
          filteredBookings.map((b) => {
            const currentStatus = b.bookingStatus || 'confirmed';
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isDarkTheme ? 'bg-[#180f22] border-pink-950/60 shadow-md' : 'bg-white border-pink-100 shadow-sm'
                }`}
              >
                {/* Header row with client and status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-slate-100">
                        {b.clientName || 'Гость студии'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                          currentStatus === 'confirmed'
                            ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                            : currentStatus === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : currentStatus === 'pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {currentStatus === 'confirmed'
                          ? 'Подтверждено'
                          : currentStatus === 'completed'
                          ? 'Завершено'
                          : currentStatus === 'pending'
                          ? 'Ожидает решения'
                          : 'Отменено'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <Phone className="w-3 h-3 text-pink-400" />
                      <span>{b.clientPhone || '+7 (927) 997-37-80'}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-serif font-bold text-sm text-pink-400">
                      {(b.price || 1800).toLocaleString('ru-RU')} ₽
                    </span>
                    <div className="text-[10px] text-slate-400">{b.date}, {b.time}</div>
                  </div>
                </div>

                {/* Service and Atmosphere */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-black/20 border border-white/5 space-y-1 text-xs">
                  <div className="font-semibold text-pink-200">
                    💅 Услуга: {b.service}
                  </div>
                  <div className="text-slate-300 flex items-center gap-1">
                    <span>Атмосфера:</span>
                    <span className="text-pink-300 font-medium">
                      {getAtmosphereLabel(b.atmosphere)}
                    </span>
                  </div>
                  {b.comments && (
                    <div className="text-slate-400 italic">
                      «{b.comments}»
                    </div>
                  )}
                  <div className="text-[10px] text-pink-400/90 font-medium pt-1 border-t border-white/5">
                    🎁 {b.gift || 'Укрепление и спа-парафин — в подарок (0 ₽)'}
                  </div>
                </div>

                {/* Cancellation Reason if cancelled */}
                {currentStatus === 'cancelled' && b.cancellationReason && (
                  <div className="mt-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                    <strong>Причина отмены:</strong> {b.cancellationReason}
                  </div>
                )}

                {/* Status action buttons */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    {/* Open WhatsApp with client */}
                    <button
                      onClick={() =>
                        handleOpenClientWhatsApp(
                          b.clientPhone || '+79279973780',
                          `Привет, ${b.clientName || ''}! Это Ангелина из ART XAOC по поводу твоей записи на «${b.service}» (${b.date} в ${b.time}).`
                        )
                      }
                      className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1"
                      title="Написать клиенту в WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentStatus === 'pending' && (
                      <button
                        onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                        className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Подтвердить</span>
                      </button>
                    )}

                    {currentStatus === 'confirmed' && (
                      <button
                        onClick={() => {
                          onUpdateBookingStatus(b.id, 'completed');
                          onIssueTicketToClient(b.clientPhone);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95"
                        title="Отметить визит как состоявшийся и начислить билет в Club"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        <span>Завершить (+1 билет)</span>
                      </button>
                    )}

                    {currentStatus !== 'cancelled' && currentStatus !== 'completed' && (
                      <button
                        onClick={() => setCancellingBookingId(b.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs font-semibold"
                      >
                        Отклонить
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline cancellation reason prompt */}
                {cancellingBookingId === b.id && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-2">
                    <label className="text-[11px] font-bold text-rose-300">
                      Укажите причину отмены записи (по регламенту ТЗ):
                    </label>
                    <input
                      type="text"
                      value={cancelReasonInput}
                      onChange={(e) => setCancelReasonInput(e.target.value)}
                      placeholder="Например: занято другим клиентом / перенос времени"
                      className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-rose-500/40 text-xs text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setCancellingBookingId(null)}
                        className="px-3 py-1 rounded-lg text-xs text-slate-400"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={() => {
                          onUpdateBookingStatus(b.id, 'cancelled', cancelReasonInput || 'Отменено мастером');
                          setCancellingBookingId(null);
                          setCancelReasonInput('');
                        }}
                        className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold"
                      >
                        Подтвердить отмену
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
