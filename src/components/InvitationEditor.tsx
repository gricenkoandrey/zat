import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Heart, Wand2 } from 'lucide-react';
import { DateInvitation, FoilStyle, EnvelopeColor, SealSymbol, PRESETS } from '../types/invitation';
import { encodeInvitationToUrl } from '../utils/share';
import { playCutePopSound } from '../utils/audio';

interface InvitationEditorProps {
  invitation: DateInvitation;
  onSave: (updated: DateInvitation) => void;
  onClose: () => void;
}

export const InvitationEditor: React.FC<InvitationEditorProps> = ({
  invitation,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<DateInvitation>({ ...invitation });
  const [copied, setCopied] = useState(false);

  const handleChange = (field: keyof DateInvitation, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyPreset = (presetData: Partial<DateInvitation>) => {
    playCutePopSound();
    setFormData((prev) => ({
      ...prev,
      ...presetData,
    }));
  };

  const handleCopyLink = () => {
    playCutePopSound();
    const url = encodeInvitationToUrl(formData);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveAndApply = () => {
    playCutePopSound();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-[#1a121c] border border-white/15 rounded-2xl p-5 sm:p-7 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 pr-8">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-cinzel font-semibold uppercase tracking-wider mb-1">
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Магический свиток • Редактор</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-magical text-amber-100">
            Настрой письмо под вашу историю
          </h2>
          <p className="text-amber-200/70 text-xs sm:text-sm mt-0.5">
            Укажи имя, выбери время и место, или используй готовую романтическую идею
          </p>
        </div>

        {/* Presets Chips */}
        <div className="mb-6">
          <label className="block text-xs text-white/60 mb-2 font-medium">
            Готовые романтические идеи:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset.data)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all hover:scale-[1.02] text-xs flex flex-col gap-1"
              >
                <span className="text-lg">{preset.icon}</span>
                <span className="font-semibold text-white/90">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Recipient */}
          <div>
            <label className="block text-white/70 mb-1 font-medium">Для кого:</label>
            <input
              type="text"
              value={formData.to}
              onChange={(e) => handleChange('to', e.target.value)}
              placeholder="Например: Для самой прекрасной Алисы ✨"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs sm:text-sm transition-colors"
            />
          </div>

          {/* Proposal Question */}
          <div>
            <label className="block text-white/70 mb-1 font-medium">Главный вопрос / приглашение:</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => handleChange('question', e.target.value)}
              placeholder="Пойдёшь со мной на свидание?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs sm:text-sm transition-colors"
            />
          </div>

          {/* When & Where Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-white/70 mb-1 font-medium">🗓️ Когда (дата и время):</label>
              <input
                type="text"
                value={formData.dateTime}
                onChange={(e) => handleChange('dateTime', e.target.value)}
                placeholder="Пятница, 19:30"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs sm:text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/70 mb-1 font-medium">📍 Где (локация):</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Ресторан на набережной..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs sm:text-sm transition-colors"
              />
            </div>
          </div>

          {/* Dress code */}
          <div>
            <label className="block text-white/70 mb-1 font-medium">👗 Дресс-код или подсказка:</label>
            <input
              type="text"
              value={formData.dressCode}
              onChange={(e) => handleChange('dressCode', e.target.value)}
              placeholder="Удобная обувь, красивое платье, или теплое пальто"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs sm:text-sm transition-colors"
            />
          </div>

          {/* Secret Message */}
          <div>
            <label className="block text-white/70 mb-1 font-medium">💌 Личное послание:</label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Твои теплые слова..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs sm:text-sm resize-none transition-colors"
            />
          </div>

          {/* Sender */}
          <div>
            <label className="block text-white/70 mb-1 font-medium">От кого (подпись):</label>
            <input
              type="text"
              value={formData.sender}
              onChange={(e) => handleChange('sender', e.target.value)}
              placeholder="Твое имя или ласковая подпись"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs sm:text-sm transition-colors"
            />
          </div>

          {/* Foil Style Selector */}
          <div>
            <label className="block text-white/70 mb-2 font-medium">Стиль стирающейся фольги:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'rosegold' as FoilStyle, name: 'Розовое золото', preview: 'bg-rose-400' },
                { id: 'gold' as FoilStyle, name: 'Золото', preview: 'bg-amber-400' },
                { id: 'silver' as FoilStyle, name: 'Серебро', preview: 'bg-slate-300' },
                { id: 'amethyst' as FoilStyle, name: 'Аметист', preview: 'bg-purple-400' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleChange('foilStyle', style.id)}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-xs transition-all ${
                    formData.foilStyle === style.id
                      ? 'bg-white/15 border-amber-400 font-semibold'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${style.preview}`} />
                  <span>{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Envelope Color */}
          <div>
            <label className="block text-white/70 mb-2 font-medium">Цвет конверта:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'burgundy' as EnvelopeColor, name: 'Бордо', color: 'bg-[#5c131e]' },
                { id: 'emerald' as EnvelopeColor, name: 'Изумруд', color: 'bg-[#0a4233]' },
                { id: 'navy' as EnvelopeColor, name: 'Синий', color: 'bg-[#0f254a]' },
                { id: 'rose' as EnvelopeColor, name: 'Роза', color: 'bg-[#5c2136]' },
              ].map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => handleChange('envelopeColor', col.id)}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-xs transition-all ${
                    formData.envelopeColor === col.id
                      ? 'bg-white/15 border-amber-400 font-semibold'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${col.color}`} />
                  <span>{col.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-7 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Ссылка скопирована!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-300" />
                <span>Скопировать ссылку для неё/него</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSaveAndApply}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-900/30 transition-all hover:scale-105"
          >
            Применить и посмотреть
          </button>
        </div>
      </div>
    </div>
  );
};
