import type { Card, Suit } from '../types';

const MAJOR_ARCANA_NAMES = [
  '愚者',
  '魔術師',
  '女教皇',
  '女帝',
  '皇帝',
  '教皇',
  '恋人',
  '戦車',
  '力',
  '隠者',
  '運命の輪',
  '正義',
  '吊るされた男',
  '死神',
  '節制',
  '悪魔',
  '塔',
  '星',
  '月',
  '太陽',
  '審判',
  '世界',
] as const;

const MINOR_ARCANA_RANKS = [
  { number: 1, name: 'エース' },
  { number: 2, name: '2' },
  { number: 3, name: '3' },
  { number: 4, name: '4' },
  { number: 5, name: '5' },
  { number: 6, name: '6' },
  { number: 7, name: '7' },
  { number: 8, name: '8' },
  { number: 9, name: '9' },
  { number: 10, name: '10' },
  { number: 11, name: 'ペイジ' },
  { number: 12, name: 'ナイト' },
  { number: 13, name: 'クイーン' },
  { number: 14, name: 'キング' },
] as const;

const SUITS: { id: Suit; name: string; nameEn: string }[] = [
  { id: 'wand', name: 'ワンド', nameEn: 'Wands' },
  { id: 'cup', name: 'カップ', nameEn: 'Cups' },
  { id: 'sword', name: 'ソード', nameEn: 'Swords' },
  { id: 'pentacle', name: 'ペンタクル', nameEn: 'Pentacles' },
];

export function generateCards(): Card[] {
  const cards: Card[] = [];

  MAJOR_ARCANA_NAMES.forEach((name, index) => {
    cards.push({
      id: `major_${index.toString().padStart(2, '0')}`,
      name,
      arcana: 'major',
      suit: null,
      number: index,
      image: `/cards/major_${index.toString().padStart(2, '0')}.svg`,
    });
  });

  SUITS.forEach(({ id: suit, name: suitName }) => {
    MINOR_ARCANA_RANKS.forEach(({ number, name: rankName }) => {
      const cardName = `${suitName}の${rankName}`;
      const suitNumber = SUITS.findIndex((s) => s.id === suit);
      const cardNumber = suitNumber * 14 + number - 1;

      cards.push({
        id: `minor_${suit}_${number.toString().padStart(2, '0')}`,
        name: cardName,
        arcana: 'minor',
        suit,
        number: cardNumber,
        image: `/cards/minor_${suit}_${number.toString().padStart(2, '0')}.svg`,
      });
    });
  });

  return cards;
}

export const CARDS = generateCards();

export const MAJOR_ARCANA = CARDS.filter((c) => c.arcana === 'major');
export const MINOR_ARCANA = CARDS.filter((c) => c.arcana === 'minor');
export const FULL_DECK = CARDS;

export function getCardById(id: string): Card | undefined {
  return CARDS.find((c) => c.id === id);
}

export function getMajorArcana(): Card[] {
  return MAJOR_ARCANA;
}

export function getMinorArcana(): Card[] {
  return MINOR_ARCANA;
}

export function getFullDeck(): Card[] {
  return FULL_DECK;
}