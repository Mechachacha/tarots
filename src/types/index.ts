export type Arcana = 'major' | 'minor';
export type Suit = 'wand' | 'cup' | 'sword' | 'pentacle' | null;
export type Position = 'upright' | 'reversed';

export interface Card {
  id: string;
  name: string;
  arcana: Arcana;
  suit: Suit;
  number: number;
  image: string;
}

export interface SpreadPreset {
  id: string;
  name: string;
  cardCount: number;
  themes: string[];
}

export interface DrawResultItem {
  theme: string;
  cardId: string;
  position: Position;
}

export interface ReadingResult {
  question: string;
  useMajorArcana: boolean;
  useMinorArcana: boolean;
  items: DrawResultItem[];
  timestamp: number;
}

export type HistoryStore = ReadingResult[];

export type SpreadMode = 'preset' | 'custom';
export type CustomSpread = { cardCount: number; themes: string[] };