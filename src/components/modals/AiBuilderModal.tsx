import React, { useState } from 'react';
import { Wand2, X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../../types';

interface AiBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme: boolean;
  onApplyCustomSet: (service: ServiceItem) => void;
}

export const AiBuilderModal: React.FC<AiBuilderModalProps> = ({
  isOpen,
  onClose,
  isDarkTheme,
  onApplyCustomSet,
}) => {
  const [length, setLength] = useState('Средние (2)');
  const [shape, setShape] = useState('Миндаль');
  const [style, setStyle] = useState('Dark Glam');
  const [accents, setAccents] = useState<string[]>(['Фигурки', 'Втирка']);

  if (!isOpen) return null;

  const lengths = ['Короткие (1)', 'Средние (2)', 'Длинные (3)', 'Экстрим (4+)'];
  const shapes = ['Миндаль', 'Мягкий квадрат', 'Стилет', 'Балерина', 'Чёткий квадрат'];
  const styles = ['Dark Glam', 'Goth Barbie Neon', 'Cyberpunk Liquid', 'Minimal Nude', 'Blood Romance'];
  const accentOptions = [
    'Фигурки',
    'Стразы',
    'Френч',
    'Градиент',
    'Наклейки',
    'Поталь',
    'Втирка',
    'Готические руны',
  ];

  const toggleAccent = (acc: string) => {
    setAccents((prev) =>
      prev.includes(acc) ? prev.filter((a) => a !== acc) : [...prev, acc]
    );
  };

  // calculate price dynamically
  let basePrice = 1800;
  if (length.includes('Длинные')) basePrice += 400;
  if (length.includes('Экстрим')) basePrice += 800;
  basePrice += accents.length * 200;

  const handleBookBuiltSet = () => {
    const customService: ServiceItem = {
      id: `custom-build-${Date.now()}`,
      category: 'manicure',
      name: `Кастом: ${style} (${shape})`,
      badge: 'AI Конструктор ✦',
      badgeType: 'art',
      duration: '110-130 мин',
      price: basePrice,
      description: `Форма ${shape}, длина ${length}. Акценты: ${accents.join(', ') || 'без акцентов'}. Включает укрепление и спа-парафин (0 ₽).`,
      featureText: 'Индивидуальный арт',
      featureIcon: 'palette',
    };

    onApplyCustomSet(customService);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md rounded-3xl p-5 border flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 shadow-2xl ${
          isDarkTheme
            ? 'bg-[#180f22] border-pink-500/40 text-slate-100'
            : 'bg-white border-pink-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-pink-500/50 shadow-md flex-shrink-0 bg-[#160a20]">
              <img
                src="/assets/art-haos-nezhity-transparent-thinking.png"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('art-haos-nezhity-transparent-hello.png')) {
                    target.src = '/assets/art-haos-nezhity-transparent-hello.png';
                  }
                }}
                alt="Нежить выбирает дизайн"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-pink-400">
                AI BUILDER · Конструктор
              </h3>
              <p className="text-[10px] text-slate-400">
                Собери авторский сет ногтей в стиле «Нежная жесть»
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Builder controls */}
        <div className="space-y-4 py-3 text-xs">
          {/* Length */}
          <div>
            <label className="font-bold text-[11px] uppercase tracking-wider text-pink-400 mb-1.5 block">
              1. Длина ногтей
            </label>
            <div className="grid grid-cols-2 gap-2">
              {lengths.map((l) => (
                <button
                  key={l}
                  onClick={() => setLength(l)}
                  className={`p-2 rounded-xl border text-left font-medium transition-all ${
                    length === l
                      ? 'bg-pink-600/30 border-pink-500 text-pink-200 shadow-xs'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-pink-500/30'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Shape */}
          <div>
            <label className="font-bold text-[11px] uppercase tracking-wider text-pink-400 mb-1.5 block">
              2. Форма свободного края
            </label>
            <div className="flex flex-wrap gap-1.5">
              {shapes.map((s) => (
                <button
                  key={s}
                  onClick={() => setShape(s)}
                  className={`py-1.5 px-3 rounded-full border text-xs font-medium transition-all ${
                    shape === s
                      ? 'bg-pink-600 text-white border-pink-500 shadow-xs'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="font-bold text-[11px] uppercase tracking-wider text-pink-400 mb-1.5 block">
              3. Эстетическое направление
            </label>
            <div className="flex flex-wrap gap-1.5">
              {styles.map((st) => (
                <button
                  key={st}
                  onClick={() => setStyle(st)}
                  className={`py-1.5 px-3 rounded-full border text-xs font-medium transition-all ${
                    style === st
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-500 shadow-xs'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Accents */}
          <div>
            <label className="font-bold text-[11px] uppercase tracking-wider text-pink-400 mb-1.5 block">
              4. Арт-элементы & Декор
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {accentOptions.map((acc) => {
                const isChecked = accents.includes(acc);
                return (
                  <button
                    key={acc}
                    onClick={() => toggleAccent(acc)}
                    className={`p-2 rounded-xl border text-left flex items-center justify-between text-[11px] font-medium transition-all ${
                      isChecked
                        ? 'bg-pink-600/20 border-pink-500/60 text-pink-300'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <span className="truncate">{acc}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-pink-400 flex-shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with price estimation and apply */}
        <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Расчётная стоимость
            </span>
            <span className="font-serif font-bold text-lg text-pink-400">
              {basePrice.toLocaleString('ru-RU')} ₽
            </span>
          </div>

          <button
            onClick={handleBookBuiltSet}
            className="py-2.5 px-5 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Выбрать этот сет</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
