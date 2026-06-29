import type { DrawResultItem, Position } from '../types';
import { getFullDeck, getMajorArcana } from '../data/cards';

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function drawCards(
  themes: string[],
  useMinorArcana: boolean
): DrawResultItem[] {
  const deck = useMinorArcana ? getFullDeck() : getMajorArcana();
  const shuffled = shuffle(deck);

  if (themes.length > shuffled.length) {
    throw new Error(
      `テーマ数(${themes.length})がデッキ枚数(${shuffled.length})を超えています`
    );
  }

  return themes.map((theme) => {
    const card = shuffled.shift()!;
    const position: Position = Math.random() < 0.5 ? 'upright' : 'reversed';
    return { theme, cardId: card.id, position };
  });
}