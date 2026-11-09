import { useState } from "react";
import { ANTACIDS } from "../model/antacids";
import type { AntacidId } from "../model/types";
import "./ReactionExplorer.css";

const formulas: Record<AntacidId, string> = {
  magnesium: "Mg(OH)₂",
  calcium: "CaCO₃",
  sodium: "NaHCO₃",
};

export default function ReactionExplorer() {
  const [selected, setSelected] = useState<AntacidId>("magnesium");
  const chemical = ANTACIDS[selected];
  return (
    <section className="reaction-explorer" aria-labelledby="explorer-title">
      <div className="explorer-heading">
        <div>
          <p className="eyebrow">02 / SIGA A TRANSFORMAÇÃO</p>
          <h1 id="explorer-title">
            Uma escolha.
            <br />
            <em>Outra reação.</em>
          </h1>
        </div>
        <p>
          Nem todo antiácido pertence à mesma função inorgânica. Escolha uma
          substância e compare o que ela forma.
        </p>
      </div>
      <div className="reagent-tabs" aria-label="Substância para explorar">
        {(Object.keys(ANTACIDS) as AntacidId[]).map((id, index) => (
          <button
            key={id}
            aria-pressed={selected === id}
            onClick={() => setSelected(id)}
          >
            <span className="reagent-index">
              0{index + 1} / {id === "magnesium" ? "BASE" : "SAL"}
            </span>
            <strong>{formulas[id]}</strong>
            <span>{ANTACIDS[id].name}</span>
            <span className="reagent-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
        ))}
      </div>
      <div className="explorer-result" aria-live="polite" aria-atomic="true">
        <div className="reaction-journey">
          <div>
            <small>ÁCIDO DO ESTÔMAGO</small>
            <strong>{chemical.capacity === 2 ? "2 HCl" : "HCl"}</strong>
            <span>Reagente</span>
          </div>
          <b aria-hidden="true">+</b>
          <div>
            <small>{selected === "magnesium" ? "BASE" : "SAL ANTIÁCIDO"}</small>
            <strong>{formulas[selected]}</strong>
            <span>Reagente</span>
          </div>
          <b aria-hidden="true">→</b>
          <div className="product-tile">
            <small>APÓS A REAÇÃO</small>
            <strong>Sal + água{chemical.gas ? " + CO₂" : ""}</strong>
            <span>
              {chemical.gas ? "Com liberação de gás" : "Sem formação de gás"}
            </span>
          </div>
        </div>
        <p className="explorer-equation">{chemical.equation}</p>
        <div className="explorer-bottom">
          <p>
            <strong>Proporção 1 : {chemical.capacity}</strong> — 1 mmol da
            substância consome {chemical.capacity} mmol de HCl.
          </p>
          <a href="#livre">
            Testar no laboratório <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
