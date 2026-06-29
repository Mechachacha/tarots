import type { SpreadPreset } from '../types';

export const SPREAD_PRESETS: SpreadPreset[] = [
  {
    id: 'one-card',
    name: 'ワンオラクル',
    cardCount: 1,
    themes: ['ワンオラクル'],
  },
  {
    id: 'three-card',
    name: 'スリーカード',
    cardCount: 3,
    themes: ['過去', '現在', '未来'],
  },
  {
    id: 'hexagram',
    name: 'ヘキサグラム',
    cardCount: 7,
    themes: [
      '過去',
      '現在',
      '未来',
      '環境',
      '潜在意識',
      '対応方法',
      '結論',
    ],
  },
  {
    id: 'celtic-cross',
    name: 'ケルト十字',
    cardCount: 10,
    themes: [
      '現在の状況',
      '障害と対策',
      '顕在している事柄・意識',
      '潜在している事柄・意識',
      '近い過去',
      '近い未来',
      '質問者の立場や状況',
      '質問者以外の人',
      '質問者の願望',
      '最終結果',
    ],
  },
];

export function getPresetById(id: string): SpreadPreset | undefined {
  return SPREAD_PRESETS.find((p) => p.id === id);
}

export function getDefaultPreset(): SpreadPreset {
  return SPREAD_PRESETS[0];
}