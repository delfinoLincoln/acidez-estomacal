import type { AntacidId, ReactionState } from '../../chemistry/model/types.ts';

export interface Mission { type: AntacidId; label: string; title: string; target: number; brief: string; options: number[]; answer: number; explanation: string; }

// Metas fictícias para exercitar proporções, sem significado clínico.
export const MISSIONS: Mission[] = [
  {
    type: 'magnesium', label: 'A base em ação', title: 'Primeiro, a base.', target: 6,
    brief: 'Use hidróxido de magnésio para consumir metade dos 12 mmol de HCl.',
    options: [2, 3, 6], answer: 3,
    explanation: '3 mmol de Mg(OH)₂ consomem 6 mmol de HCl e formam 6 mmol de água.'
  },
  {
    type: 'calcium', label: 'O sal que libera gás', title: 'De onde vem o gás?', target: 4,
    brief: 'Use carbonato de cálcio e deixe 4 mmol de HCl no modelo. Observe o CO₂.',
    options: [4, 6, 8], answer: 4,
    explanation: '4 mmol de CaCO₃ consomem 8 mmol de HCl e liberam 4 mmol de CO₂.'
  },
  {
    type: 'sodium', label: 'Uma nova proporção', title: 'A proporção mudou.', target: 8,
    brief: 'Agora use bicarbonato de sódio para consumir 4 dos 12 mmol de HCl.',
    options: [2, 4, 8], answer: 4,
    explanation: '4 mmol de NaHCO₃ consomem 4 mmol de HCl. A proporção é 1 : 1.'
  }
];

export function isMissionComplete(state: ReactionState, mission: Mission) {
  return state.acid === mission.target;
}
