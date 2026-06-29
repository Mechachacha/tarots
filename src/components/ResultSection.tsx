import { useRef, useEffect } from 'react';
import type { ReadingResult, Card } from '../types';
import CardItem from './CardItem';
import AiPromptBox from './AiPromptBox';
import ShareButtons from './ShareButtons';

interface ResultSectionProps {
  result: ReadingResult;
  cards: Card[];
  onRedraw: () => void;
  onReset: () => void;
  onCopyPrompt: (text: string) => void;
  onShareTwitter: (text: string) => void;
  onCopyShare: (text: string) => void;
}

const ResultSection: React.FC<ResultSectionProps> = ({
  result,
  onRedraw,
  onReset,
  onCopyPrompt,
  onShareTwitter,
  onCopyShare,
}) => {
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <section
      ref={resultRef}
      className="card p-6 animate-slide-up"
      aria-labelledby="result-heading"
    >
      <header className="mb-6 pb-4 border-b border-tarot-dark/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="result-heading" className="text-2xl font-bold text-tarot-dark">
            占い結果
          </h2>
          {result.question && (
            <p className="text-tarot-dark/60 mt-1">
              「{result.question}」
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRedraw}
            className="btn-secondary"
            aria-label="同じ条件でもう一度引く"
          >
            ひきなおし
          </button>
          <button
            onClick={onReset}
            className="btn-ghost"
            aria-label="最初からやり直す"
          >
            もういちど
          </button>
        </div>
      </header>

      <div className="grid gap-4 mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl" role="list">
        {result.items.map((item, index) => (
          <CardItem
            key={`${item.cardId}-${index}`}
            item={item}
            delay={index * 100}
          />
        ))}
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