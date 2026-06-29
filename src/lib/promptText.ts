import type { DrawResultItem } from '../types';
import { CARDS } from '../data/cards';

export function generatePromptText(
  question: string,
  items: DrawResultItem[]
): string {
  const lines = [
    `質問：${question || '（質問なし）'}`,
    '回答：',
  ];

  items.forEach((item, index) => {
    const card = CARDS.find((c) => c.id === item.cardId);
    const cardName = card?.name || '不明なカード';
    const positionText = item.position === 'upright' ? '正位置' : '逆位置';
    lines.push(`${index + 1}. ${item.theme}…${cardName} (${positionText})`);
  });

  lines.push('', 'この結果を解釈して');

  return lines.join('\n');
}