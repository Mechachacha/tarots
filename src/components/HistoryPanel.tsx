import { useState } from 'react';
import { format } from 'date-fns';
import type { ReadingResult, Card } from '../types';
import { getCardById } from '../data/cards';
import CardItem from './CardItem';

interface HistoryPanelProps {
  history: ReadingResult[];
  cards: Card[];
  onCopyPrompt: (text: string) => void;
  onViewResult: (result: ReadingResult) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, cards, onCopyPrompt, onViewResult }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (history.length === 0) {
    return (
      <section className="card p-6" aria-labelledby="history-heading">
        <h2 id="history-heading" className="text-xl font-semibold text-tarot-light mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-tarot-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          過去の結果
        </h2>
        <p className="text-tarot-text-muted text-center py-8">
          まだ占い結果がありません。「占う」ボタンを押してみてください。
        </p>
      </section>
    );
  }

  return (
    <section className="card" aria-labelledby="history-heading">
      <header className="p-6 border-b border-white/10">
        <h2 id="history-heading" className="text-xl font-semibold text-tarot-light flex items-center gap-2">
          <svg className="w-6 h-6 text-tarot-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          過去の結果（直近5件）
        </h2>
      </header>
      <div className="divide-y divide-white/10">
        {history.slice(0, 5).map((result, index) => (
          <details
            key={result.timestamp}
            className="group"
            open={openIndex === index}
          >
            <summary
              onClick={(e) => {
                e.preventDefault();
                setOpenIndex(openIndex === index ? null : index);
              }}
              className="p-4 flex items-center justify-between cursor-pointer list-none bg-tarot-mid hover:bg-white/5 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-medium text-tarot-light">
                    {`${index + 1}回前`}
                  </span>
                  <span className="text-sm text-tarot-text-muted">
                    {format(new Date(result.timestamp), 'MM/dd HH:mm')}
                  </span>
                  {(() => {
                    const hasMajor = result.useMajorArcana ?? true;
                    const hasMinor = result.useMinorArcana ?? false;
                    let badge: string;
                    if (hasMajor && hasMinor) badge = '全78枚';
                    else if (hasMajor) badge = '大アルカナ22枚';
                    else badge = '小アルカナ56枚';
                    return (
                      <span className="px-2 py-0.5 text-xs bg-tarot-gold/20 text-tarot-gold rounded-full">
                        {badge}
                      </span>
                    );
                  })()}
                </div>
                {result.question && (
                  <p className="text-tarot-text mt-1 truncate">
                    「{result.question}」
                  </p>
                )}
              </div>
              <svg
                className={`w-5 h-5 text-tarot-text-muted transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="p-4 bg-white/5 animate-fade-in">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewResult(result);
                }}
                className="btn-primary w-full mb-4 text-sm"
              >
                この結果を表示
              </button>
              <div className="flex flex-wrap justify-center gap-3 mb-4" role="list" aria-label="カード一覧">
                {result.items.map((item) => (
                  <CardItem
                    key={item.cardId}
                    item={item}
                    compact
                  />
                ))}
              </div>
              <details className="mb-4 group">
                <summary className="text-xs text-tarot-text-muted cursor-pointer hover:text-tarot-light transition-colors list-none">
                  ▸ 引いたカード一覧（テキスト）
                </summary>
                <ol className="mt-2 space-y-1">
                  {result.items.map((item, i) => {
                    const card = getCardById(item.cardId);
                    const name = card?.name || '不明なカード';
                    const pos = item.position === 'upright' ? '正位置' : '逆位置';
                    return (
                      <li key={item.cardId} className="text-xs text-tarot-text flex gap-1">
                        <span className="text-tarot-text-muted shrink-0">{i + 1}.</span>
                        <span>
                          <span className="text-tarot-gold">{item.theme}</span>
                          {' → '}
                          <span className="text-tarot-light font-medium">{name}</span>
                          {' '}
                          <span className={item.position === 'upright' ? 'text-tarot-gold' : 'text-tarot-purple'}>
                            ({pos})
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </details>
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