import { useState } from 'react';
import { format } from 'date-fns';
import type { ReadingResult, Card } from '../types';
import CardItem from './CardItem';

interface HistoryPanelProps {
  history: ReadingResult[];
  cards: Card[];
  onCopyPrompt: (text: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, cards, onCopyPrompt }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (history.length === 0) {
    return (
      <section className="card p-6" aria-labelledby="history-heading">
        <h2 id="history-heading" className="text-xl font-semibold text-tarot-dark mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-tarot-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          過去の結果
        </h2>
        <p className="text-tarot-dark/50 text-center py-8">
          まだ占い結果がありません。「占う」ボタンを押してみてください。
        </p>
      </section>
    );
  }

  return (
    <section className="card" aria-labelledby="history-heading">
      <header className="p-6 border-b border-tarot-dark/10">
        <h2 id="history-heading" className="text-xl font-semibold text-tarot-dark flex items-center gap-2">
          <svg className="w-6 h-6 text-tarot-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          過去の結果（直近5件）
        </h2>
      </header>
      <div className="divide-y divide-tarot-dark/10">
        {history.slice(0, 5).map((result, index) => (
          <details
            key={result.timestamp}
            className="group"
            open={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <summary className="p-4 flex items-center justify-between cursor-pointer list-none bg-tarot-light hover:bg-tarot-dark/5 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-medium text-tarot-dark">
                    {index === 0 ? '直前' : `${index}回前`}
                  </span>
                  <span className="text-sm text-tarot-dark/50">
                    {format(new Date(result.timestamp), 'MM/dd HH:mm')}
                  </span>
                  {result.useMinorArcana && (
                    <span className="px-2 py-0.5 text-xs bg-tarot-gold/20 text-tarot-gold rounded-full">
                      78枚
                    </span>
                  )}
                </div>
                {result.question && (
                  <p className="text-tarot-dark/60 mt-1 truncate">
                    「{result.question}」
                  </p>
                )}
              </div>
              <svg
                className={`w-5 h-5 text-tarot-dark/50 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="p-4 bg-tarot-dark/5 animate-fade-in">
              <div className="flex flex-wrap justify-center gap-3 mb-4" role="list" aria-label="カード一覧">
                {result.items.map((item) => (
                  <CardItem
                    key={item.cardId}
                    item={item}
                    compact
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  const promptText = `質問：${result.question || '（質問なし）'}\n回答：\n` +
                    result.items.map((item, i) => {
                      const card = cards.find(c => c.id === item.cardId);
                      const name = card?.name || '不明なカード';
                      const pos = item.position === 'upright' ? '正位置' : '逆位置';
                      return `${i + 1}. ${item.theme}…${name} (${pos})`;
                    }).join('\n') +
                    '\nこの結果を解釈して';
                  onCopyPrompt(promptText);
                }}
                className="btn-ghost text-sm w-full"
              >
                プロンプトをコピー
              </button>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};

export default HistoryPanel;