// Tipos tornam explícitos os dados usados pela simulação.
export type AntacidId = "magnesium" | "calcium" | "sodium";
export interface Chemical {
  name: string;
  capacity: number; // mmol de HCl consumidos por 1 mmol de substância
  gas: number; // mmol de CO2 formados por 1 mmol de substância
  water: number;
  note: string;
  equation: string;
}
export interface ReactionState {
  acid: number;
  additions: number;
  gas: number;
  water: number;
}
