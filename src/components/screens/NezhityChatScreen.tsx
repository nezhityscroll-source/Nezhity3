import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Heart, Wand2, Calendar } from 'lucide-react';
import { TabType, ChatMessage } from '../../types';

interface NezhityChatScreenProps {
  isDarkTheme: boolean;
  onNavigate: (tab: TabType) => void;
  onOpenAiBuilder: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'nezhity',
    text: 'Привет, душа моя! ♡ Я Нежить — хранительница стиля и дерзкого ухода в ART XAOC. Что тебя интересует: подберём крышесносный сет, разберём домашний уход или запишем к Ангелине?',
    time: '12:00',
    suggestions: [
      'Какой дизайн посоветуешь?',
      'Как ухаживать за кутикулой?',
      'Что входит в бесплатный спа-парафин?',
      'Помоги выбрать форму ногтей',
    ],
  },
];

export const NezhityChatScreen: React.FC<NezhityChatScreenProps> = ({
  isDarkTheme,
  onNavigate,
  onOpenAiBuilder,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('дизайн') || q.includes('посоветуй') || q.includes('сет')) {
      return 'О-о, в этом сезоне правит бал эстетика Dark Glam и Cyber Fairy! Стильный френч, мягкий градиент, объёмные фигурки, мерцающая втирка, поталь и стразы. Хочешь собрать свой индивидуальный сет? Нажми Конструктор! ✦';
    }
    if (q.includes('кутикул') || q.includes('масло') || q.includes('уход')) {
      return 'Главное правило Нежити: наноси сухое масло минимум дважды в день — особенно перед сном. Это питает матрикс и предотвращает заусенцы. А в студии мы каждому дарим коллагеновую ванночку и армирование! 🩸';
    }
    if (q.includes('парафин') || q.includes('подарок') || q.includes('укрепление')) {
      return 'Да! При любой записи на маникюр или сет мы дарим укрепление ультра-прочным гелем и горячий спа-парафин (обычно это стоит 800 ₽, но у нас — 0 ₽). Мы заботимся о твоих пальчиках без скрытых наценок ♡';
    }
    if (q.includes('форм') || q.includes('длин')) {
      return 'Для тонких изящных пальчиков идеально подходит «мягкий квадрат» или дерзкий «миндаль». А если жаждешь драмы и взглядов — выбирай стилеты длины 4+. Мы делаем их прочными как клинки!';
    }
    if (q.includes('запис') || q.includes('цен') || q.includes('прайс')) {
      return 'У нас прозрачный прайс: классический маникюр с покрытием — 1 800 ₽, педикюр от 1 500 ₽, а сеты с выгодой до 500 ₽. Переходи во вкладку «Запись», чтобы занять удобное время у Ангелины!';
    }
    return `Звучит потрясающе! Любой твой каприз мы воплотим в ART XAOC с фирменной нежностью и жестью. Загляни во вкладку «Запись» или открой наш AI BUILDER для создания сета мечты! ♡`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotResponse(text);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'nezhity',
        text: reply,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'Хочу записаться на маникюр',
          'Собрать свой сет в AI Builder',
        ],
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div id="screen-nezhity-chat" className="flex flex-col h-[calc(100vh-145px)] pb-14 animate-in fade-in duration-300">
      {/* MASCOT CHAT BANNER */}
      <div
        id="nezhity-chat-banner"
        className={`p-3 rounded-2xl border flex items-center justify-between mb-3 shadow-md ${
          isDarkTheme
            ? 'bg-gradient-to-r from-[#22102e] via-[#1a0c24] to-[#2b0e33] border-pink-900/40 text-slate-100'
            : 'bg-white border-pink-200 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full ring-2 ring-pink-500 overflow-hidden shadow-lg bg-[#180a22]">
            <img
              src="/assets/art-haos-nezhity-transparent-hello.png"
              alt="Нежить"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain p-0.5"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-black" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-sm text-pink-300">Нежить</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-400 font-extrabold">
                AI GUIDESS
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              «Красота без шаблонов и компромиссов»
            </span>
          </div>
        </div>

        <button
          onClick={onOpenAiBuilder}
          className="px-2.5 py-1.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-300 text-[11px] font-bold flex items-center gap-1"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Конструктор</span>
        </button>
      </div>

      {/* CHAT MESSAGES SCROLL AREA */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {messages.map((msg) => {
          const isNezhity = msg.sender === 'nezhity';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isNezhity ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isNezhity
                    ? isDarkTheme
                      ? 'bg-[#1e102b] border border-pink-950 text-slate-100 shadow-md'
                      : 'bg-white border border-pink-100 text-slate-800 shadow-sm'
                    : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium shadow-md'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-[9px] block text-right mt-1.5 ${
                    isNezhity ? 'text-slate-400' : 'text-pink-200'
                  }`}
                >
                  {msg.time}
                </span>
              </div>

              {/* Suggestions chips */}
              {isNezhity && msg.suggestions && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (s.includes('записаться')) {
                          onNavigate('booking');
                        } else if (s.includes('Builder')) {
                          onOpenAiBuilder();
                        } else {
                          handleSendMessage(s);
                        }
                      }}
                      className={`text-[11px] py-1 px-2.5 rounded-full border transition-all active:scale-95 text-left ${
                        isDarkTheme
                          ? 'bg-pink-950/40 border-pink-500/30 text-pink-300 hover:bg-pink-900/50'
                          : 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-pink-400 text-xs italic p-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.4s]" />
            <span className="ml-1 text-[11px]">Нежить подбирает ответ...</span>
          </div>
        )}
      </div>

      {/* INPUT BAR */}
      <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-2">
        <input
          id="input-nezhity-chat"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Спроси Нежить о дизайне, уходе или записи..."
          className={`flex-1 py-2.5 px-3.5 rounded-full text-xs border outline-none transition-colors ${
            isDarkTheme
              ? 'bg-[#180f22] border-pink-900/50 text-slate-100 placeholder:text-slate-500 focus:border-pink-500'
              : 'bg-white border-pink-200 text-slate-900 placeholder:text-slate-400 focus:border-pink-500 shadow-sm'
          }`}
        />
        <button
          id="btn-send-nezhity-chat"
          onClick={() => handleSendMessage()}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all hover:brightness-110 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
