import { useState, useEffect } from 'react';
import type { DrawResultItem } from '../types';
import { getCardById } from '../data/cards';

interface CardItemProps {
  item: DrawResultItem;
  delay?: number;
  compact?: boolean;
}

const CardItem: React.FC<CardItemProps> = ({
  item,
  delay = 0,
  compact = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const card = getCardById(item.cardId);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(true);
    }, 300 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!card) return null;

  const positionText = item.position === 'upright' ? '正位置' : '逆位置';
  const positionClass = item.position === 'upright' ? 'text-tarot-gold' : 'text-tarot-purple';
  const imageSize = 'w-full h-full';

  return (
    <article
      className={`card card-hover animate-fade-in relative group ${isFlipped ? '' : 'card-back'}`}
      style={{ animationDelay: `${delay}ms` }}
      role="listitem"
      aria-label={`${item.theme}: ${card.name} (${positionText})`}
    >
      <div className="relative aspect-[2/3]">
        <div
          className={`absolute inset-0 transition-all duration-500 ease-out transform-style-preserve-3d backface-hidden ${
            isFlipped ? 'rotate-y-0' : 'rotate-y-180'
          }`}
        >
          <div className="absolute inset-0 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
            <img
              src="/cards/back.svg"
              alt="カードの裏面"
              className={`${imageSize} object-cover rounded-t-xl`}
            />
          </div>
          <div
            className={`absolute inset-0 backface-hidden transform-style-preserve-3d ${
              isFlipped ? '' : 'rotate-y-180'
            }`}
          >
            <img
              src={card.image}
              alt={`${card.name}のカード画像`}
              className={`${imageSize} object-cover rounded-t-xl card-image ${
                item.position === 'reversed' ? 'rotate-180' : ''
              }`}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {!compact && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-tarot-dark/60 uppercase tracking-wide">
              {item.theme}
            </span>
            <span className={`text-xs font-semibold ${positionClass}`}>
              {positionText}
            </span>
          </div>
          <h3 className="font-semibold text-tarot-dark text-lg">{card.name}</h3>
          <p className="text-xs text-tarot-dark/50 mt-1">
            {card.arcana === 'major' ? '大アルカナ' : `小アルカナ・${card.suit}`}
          </p>
        </div>
      )}
    </article>
  );
};

export default CardItem;