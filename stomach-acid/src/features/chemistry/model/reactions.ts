import { ANTACIDS } from "./antacids.ts";
import type { AntacidId, ReactionState } from "./types.ts";

export const INITIAL_ACID = 12; // Quantidade didática, sem equivalência clínica.
export function initialState(): ReactionState {
  return { acid: INITIAL_ACID, additions: 0, gas: 0, water: 0 };
}

// 2. Cada clique adiciona 1 mmol. O ácido disponível limita a reação.
// Não calculamos pH, dissolução, velocidade ou secreção do estômago.
export function neutralize(
  state: ReactionState,
  type: AntacidId,
): ReactionState {
  const chemical = ANTACIDS[type];
  if (state.acid <= 0) return { ...state };
  const reacted = Math.min(1, state.acid / chemical.capacity);
  return {
    acid: Math.max(0, state.acid - reacted * chemical.capacity),
    additions: state.additions + 1,
    gas: state.gas + reacted * chemical.gas,
    water: state.water + reacted * chemical.water,
  };
}
