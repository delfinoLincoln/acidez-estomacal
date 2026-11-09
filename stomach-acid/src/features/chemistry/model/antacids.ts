import type { AntacidId, Chemical } from "./types.ts";

// 1. Coeficientes obtidos das equações químicas balanceadas.
export const ANTACIDS: Record<AntacidId, Chemical> = {
  magnesium: {
    name: "Hidróxido de magnésio",
    capacity: 2,
    gas: 0,
    water: 2,
    note: "Função inorgânica: base. Componente do leite de magnésia.",
    equation: "Mg(OH)₂(s) + 2 HCl(aq) → MgCl₂(aq) + 2 H₂O(l)",
  },
  calcium: {
    name: "Carbonato de cálcio",
    capacity: 2,
    gas: 1,
    water: 1,
    note: "Função inorgânica: sal. O carbonato reage com ácido e libera CO₂.",
    equation: "CaCO₃(s) + 2 HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)",
  },
  sodium: {
    name: "Bicarbonato de sódio",
    capacity: 1,
    gas: 1,
    water: 1,
    note: "Função inorgânica: sal. O bicarbonato também consome ácido.",
    equation: "NaHCO₃(aq) + HCl(aq) → NaCl(aq) + H₂O(l) + CO₂(g)",
  },
};
