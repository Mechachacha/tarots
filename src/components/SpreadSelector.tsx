import { useState, useEffect, type ChangeEvent, type KeyboardEvent } from 'react';
import type { SpreadPreset } from '../types';

interface SpreadSelectorProps {
  mode: 'preset' | 'custom';
  onModeChange: (mode: 'preset' | 'custom') => void;
  presets: SpreadPreset[];
  selectedPresetId: string | null;
  onPresetChange: (id: string) => void;
  customCardCount: number;
  onCustomCardCountChange: (count: number) => void;
  customThemes: string[];
  onCustomThemesChange: (themes: string[]) => void;
}

const SpreadSelector: React.FC<SpreadSelectorProps> = ({
  mode,
  onModeChange,
  presets,
  selectedPresetId,
  onPresetChange,
  customCardCount,
  onCustomCardCountChange,
  customThemes,
  onCustomThemesChange,
}) => {
  const [localCustomCardCount, setLocalCustomCardCount] = useState(customCardCount);
  const [localCustomThemes, setLocalCustomThemes] = useState(customThemes);

  useEffect(() => {
    setLocalCustomCardCount(customCardCount);
  }, [customCardCount]);

  useEffect(() => {
    setLocalCustomThemes(customThemes);
  }, [customThemes]);

  useEffect(() => {
    if (mode === 'custom') {
      onCustomCardCountChange(localCustomCardCount);
    }
  }, [localCustomCardCount, mode, onCustomCardCountChange]);

  useEffect(() => {
    if (mode === 'custom') {
      onCustomThemesChange(localCustomThemes);
    }
  }, [localCustomThemes, mode, onCustomThemesChange]);

  const handleCustomCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0 && num <= 78) {
      setLocalCustomCardCount(num);
      adjustThemes(num);
    }
  };

  const adjustThemes = (newCount: number) => {
    const newThemes = [...localCustomThemes];
    if (newCount > newThemes.length) {
      for (let i = newThemes.length; i < newCount; i++) {
        newThemes.push(`${i + 1}枚目`);
      }
    } else {
      newThemes.length = newCount;
    }
    setLocalCustomThemes(newThemes);
  };

  const handleThemeChange = (index: number, value: string) => {
    const newThemes = [...localCustomThemes];
    newThemes[index] = value;
    setLocalCustomThemes(newThemes);
  };

  const handleThemeKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextInput = document.getElementById(`theme-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="mb-6">
      <label className="label">スプレッド選択</label>

      <div className="mb-4" role="radiogroup" aria-label="スプレッドモード選択">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            role="radio"
            aria-checked={mode === 'preset'}
            onClick={() => onModeChange('preset')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'preset'
                ? 'bg-tarot-purple text-white'
                : 'bg-white text-tarot-dark border border-tarot-dark/20 hover:bg-tarot-purple/10'
            }`}
          >
            プリセット
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={mode === 'custom'}
            onClick={() => onModeChange('custom')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'custom'
                ? 'bg-tarot-purple text-white'
                : 'bg-white text-tarot-dark border border-tarot-dark/20 hover:bg-tarot-purple/10'
            }`}
          >
            カスタム
          </button>
        </div>
      </div>

      {mode === 'preset' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="radiogroup" aria-label="プリセットスプレッド選択">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              role="radio"
              aria-checked={selectedPresetId === preset.id}
              onClick={() => onPresetChange(preset.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedPresetId === preset.id
                  ? 'border-tarot-purple bg-tarot-purple/5'
                  : 'border-tarot-dark/10 bg-white hover:border-tarot-purple/30'
              }`}
            >
              <div className="font-medium text-tarot-dark">{preset.name}</div>
              <div className="text-sm text-tarot-dark/60 mt-1">
                {preset.cardCount}枚
              </div>
              <div className="text-xs text-tarot-dark/40 mt-2 line-clamp-2">
                {preset.themes.join('、')}
              </div>
            </button>
          ))}
        </div>
      )}

      {mode === 'custom' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="custom-count" className="label">
              カード枚数（1〜78）
            </label>
            <input
              type="number"
              id="custom-count"
              value={localCustomCardCount}
              onChange={handleCustomCountChange}
              min="1"
              max="78"
              className="input w-32"
              aria-describedby="custom-count-hint"
            />
            <p id="custom-count-hint" className="mt-1 text-sm text-tarot-dark/50">
              枚数を変更するとテーマ入力欄が自動調整されます
            </p>
          </div>

          <div>
            <label className="label">テーマ入力</label>
            <div className="space-y-2" role="list" aria-label="カスタムテーマ一覧">
              {localCustomThemes.map((theme, index) => (
                <div key={index} className="flex gap-2" role="listitem">
                  <span className="flex items-center px-3 text-tarot-dark/50 bg-tarot-dark/5 rounded-lg">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    id={`theme-${index}`}
                    value={theme}
                    onChange={(e) => handleThemeChange(index, e.target.value)}
                    onKeyDown={(e) => handleThemeKeyDown(e, index)}
                    placeholder={`${index + 1}枚目のテーマ`}
                    className="input flex-1"
                    aria-label={`${index + 1}枚目のテーマ`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpreadSelector;