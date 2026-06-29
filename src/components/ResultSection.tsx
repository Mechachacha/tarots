import { useRef, useEffect, type ReactNode } from 'react';
import type { ReadingResult, Card, DrawResultItem } from '../types';
import { getCardById } from '../data/cards';
import CardItem from './CardItem';
import AiPromptBox from './AiPromptBox';
import ShareButtons from './ShareButtons';

interface ResultSectionProps {
  result: ReadingResult;
  cards: Card[];
  onRedraw: () => void;
  onCopyPrompt: (text: string) => void;
  onShareTwitter: (text: string) => void;
  onCopyShare: (text: string) => void;
}

function getSpreadLayout(
  items: DrawResultItem[],
  renderCard: (item: DrawResultItem, index: number) => ReactNode
): ReactNode {
  const count = items.length;

  if (count === 7) {
    return (
      <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto items-start" role="list">
        {items.map((item, i) => {
          const gridStyle: React.CSSProperties = {};
          if (i === 0) { gridStyle.gridColumn = '2'; gridStyle.gridRow = '1'; }
          else if (i === 1) { gridStyle.gridColumn = '1'; gridStyle.gridRow = '2'; }
          else if (i === 2) { gridStyle.gridColumn = '3'; gridStyle.gridRow = '2'; }
          else if (i === 3) { gridStyle.gridColumn = '1'; gridStyle.gridRow = '3'; }
          else if (i === 4) { gridStyle.gridColumn = '2'; gridStyle.gridRow = '3'; }
          else if (i === 5) { gridStyle.gridColumn = '3'; gridStyle.gridRow = '3'; }
          else if (i === 6) { gridStyle.gridColumn = '2'; gridStyle.gridRow = '4'; }
          return <div key={item.cardId} style={gridStyle}>{renderCard(item, i)}</div>;
        })}
      </div>
    );
  }

  if (count === 10) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center" role="list">
        <div className="grid grid-cols-3 gap-3 max-w-sm flex-shrink-0">
          {items.slice(0, 4).map((item, i) => {
            const gridStyle: React.CSSProperties = {};
            if (i === 0) { gridStyle.gridColumn = '2'; gridStyle.gridRow = '2'; }
            else if (i === 1) { gridStyle.gridColumn = '1'; gridStyle.gridRow = '2'; }
            else if (i === 2) { gridStyle.gridColumn = '3'; gridStyle.gridRow = '2'; }
            else if (i === 3) { gridStyle.gridColumn = '2'; gridStyle.gridRow = '3'; }
            return <div key={item.cardId} style={gridStyle}>{renderCard(item, i)}</div>;
          })}
          {items.slice(4, 5).map((item, i) => (
            <div key={item.cardId} style={{ gridColumn: '2', gridRow: '1' }}>
              {renderCard(item, i + 4)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 max-w-xs">
          {items.slice(5).map((item, i) => (
            <div key={item.cardId}>{renderCard(item, i + 5)}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl" role="list">
      {items.map((item, index) => (
        <div key={item.cardId}>{renderCard(item, index)}</div>
      ))}
    </div>
  );
}

const ResultSection: React.FC<ResultSectionProps> = ({
  result,
  onRedraw,
  onCopyPrompt,
  onShareTwitter,
  onCopyShare,
}) => {
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const renderCard = (item: DrawResultItem, index: number) => (
    <CardItem item={item} delay={index * 100} />
  );

  return (
    <section
      ref={resultRef}
      className="card p-6 animate-slide-up mb-10"
      aria-labelledby="result-heading"
    >
      <header className="mb-6 pb-4 border-b border-white/10">
        <div>
          <h2 id="result-heading" className="text-2xl font-bold text-tarot-light">
            占い結果
          </h2>
          {result.question && (
            <p className="text-tarot-text mt-1">
              「{result.question}」
            </p>
          )}
        </div>
      </header>

      {getSpreadLayout(result.items, renderCard)}

      <div className="flex justify-center mt-6">
        <button
          onClick={onRedraw}
          className="btn-primary w-full sm:w-64 lg:w-80 text-lg py-4"
          aria-label="同じ条件でもう一度引く"
        >
          ひきなおし
        </button>
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-lg mb-6">
        <h3 className="text-base font-semibold text-tarot-light mb-4">引いたカード</h3>
        <ol className="space-y-2">
          {result.items.map((item, i) => {
            const card = getCardById(item.cardId);
            const name = card?.name || '不明なカード';
            const pos = item.position === 'upright' ? '正位置' : '逆位置';
            return (
              <li key={item.cardId} className="text-sm text-tarot-text flex gap-2">
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
      </div>

      <AiPromptBox
        question={result.question}
        items={result.items}
        onCopy={onCopyPrompt}
      />

      <ShareButtons
        question={result.question}
        items={result.items}
        onShareTwitter={onShareTwitter}
        onCopyShare={onCopyShare}
      />
    </section>
  );
};

export default ResultSection;