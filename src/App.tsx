import { useState, useCallback } from 'react';
import { CARDS } from './data/cards';
import { SPREAD_PRESETS, getPresetById } from './data/spreadPresets';
import { drawCards } from './lib/draw';
import { loadHistory, addToHistory } from './lib/history';
import type {
  SpreadMode,
  ReadingResult,
  HistoryStore,
} from './types';
import QuestionInput from './components/QuestionInput';
import MinorArcanaToggle from './components/MinorArcanaToggle';
import SpreadSelector from './components/SpreadSelector';
import DrawButton from './components/DrawButton';
import ResultSection from './components/ResultSection';
import HistoryPanel from './components/HistoryPanel';

function App() {
  const [question, setQuestion] = useState('');
  const [useMajorArcana, setUseMajorArcana] = useState(true);
  const [useMinorArcana, setUseMinorArcana] = useState(true);
  const [spreadMode, setSpreadMode] = useState<SpreadMode>('preset');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(SPREAD_PRESETS[0].id);
  const [customCardCount, setCustomCardCount] = useState(1);
  const [customThemes, setCustomThemes] = useState<string[]>(['1枚目']);
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [history, setHistory] = useState<HistoryStore>(() => loadHistory());
  const [isDrawing, setIsDrawing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentThemes = useCallback((): string[] => {
    if (spreadMode === 'preset' && selectedPresetId) {
      const preset = getPresetById(selectedPresetId);
      return preset?.themes || [];
    }
    return customThemes;
  }, [spreadMode, selectedPresetId, customThemes]);

  const handleDraw = useCallback(async () => {
    const themes = getCurrentThemes();
    if (themes.length === 0) {
      setError('テーマが設定されていません');
      return;
    }

    setIsDrawing(true);
    setError(null);

    try {
      const items = drawCards(themes, useMajorArcana, useMinorArcana);
      const newResult: ReadingResult = {
        question,
        useMajorArcana,
        useMinorArcana,
        items,
        timestamp: Date.now(),
      };
      setResult(newResult);
      const newHistory = addToHistory(newResult);
      setHistory(newHistory);
      setShowResult(true);
      setIsDrawing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      setIsDrawing(false);
    }
  }, [getCurrentThemes, useMajorArcana, useMinorArcana, question]);

  const handleRedraw = useCallback(() => {
    const themes = getCurrentThemes();
    if (themes.length === 0) return;

    setIsDrawing(true);
    setError(null);

    try {
      const items = drawCards(themes, useMajorArcana, useMinorArcana);
      const newResult: ReadingResult = {
        question,
        useMajorArcana,
        useMinorArcana,
        items,
        timestamp: Date.now(),
      };
      setResult(newResult);
      const newHistory = addToHistory(newResult);
      setHistory(newHistory);
      setIsDrawing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      setIsDrawing(false);
    }
  }, [getCurrentThemes, useMajorArcana, useMinorArcana, question]);

  const handleCopyPrompt = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Ignore clipboard errors
    }
  }, []);

  const handleCopyShare = useCallback(async (text: string) => {
    const url = window.location.href;
    const shareText = `${text}\n\n${url}`;
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      // Ignore clipboard errors
    }
  }, []);

  const handleViewHistory = useCallback((historyResult: ReadingResult) => {
    setResult(historyResult);
    setShowResult(true);
    setError(null);
  }, []);

  const currentThemes = getCurrentThemes();
  const canDraw = currentThemes.length > 0;

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-tarot-gold mb-2">
            タロット占い
          </h1>
          <p className="text-tarot-text">
            質問とスプレッドを選んで、カードを引こう
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 text-red-300 rounded-lg" role="alert">
            {error}
          </div>
        )}

        <section className="card p-6 mb-8" aria-labelledby="input-heading">
          <h2 id="input-heading" className="text-xl font-semibold text-tarot-light mb-6">
            設定
          </h2>

          <QuestionInput
            value={question}
            onChange={setQuestion}
            placeholder="占いたいことを入力してください（任意）"
          />

          <MinorArcanaToggle
            useMajor={useMajorArcana}
            useMinor={useMinorArcana}
            onChange={(major, minor) => {
              setUseMajorArcana(major);
              setUseMinorArcana(minor);
            }}
          />

          <SpreadSelector
            mode={spreadMode}
            onModeChange={setSpreadMode}
            presets={SPREAD_PRESETS}
            selectedPresetId={selectedPresetId}
            onPresetChange={setSelectedPresetId}
            customCardCount={customCardCount}
            onCustomCardCountChange={setCustomCardCount}
            customThemes={customThemes}
            onCustomThemesChange={setCustomThemes}
          />

          <DrawButton
            onClick={handleDraw}
            disabled={!canDraw || isDrawing}
            isLoading={isDrawing}
          />
        </section>

        {showResult && result && (
          <ResultSection
            result={result}
            cards={CARDS}
            onRedraw={handleRedraw}
            onCopyPrompt={handleCopyPrompt}
            onCopyShare={handleCopyShare}
          />
        )}

        <HistoryPanel
          history={history}
          cards={CARDS}
          onCopyPrompt={handleCopyPrompt}
          onViewResult={handleViewHistory}
        />
      </main>

      <footer className="text-center py-8 text-tarot-text-muted text-sm">
        <p>Rider-Waite-Smith Tarot Deck (Public Domain)</p>
        <p className="mt-1">Built with React + TypeScript + Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;