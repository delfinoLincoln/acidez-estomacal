import { ANTACIDS } from "../../chemistry/model/antacids";
import type { AntacidId } from "../../chemistry/model/types";
import type { LaboratoryController } from "../hooks/useLaboratory";
type Props = { free: boolean } & Pick<
  LaboratoryController,
  | "state"
  | "selected"
  | "chemical"
  | "solved"
  | "prediction"
  | "selectAntacid"
  | "addAntacid"
  | "verify"
  | "resetExperiment"
>;
export default function ExperimentControls({
  free,
  state,
  selected,
  chemical,
  solved,
  prediction,
  selectAntacid,
  addAntacid,
  verify,
  resetExperiment,
}: Props) {
  return (
    <div className="controls">
      <p className="eyebrow">
        {free ? "01 / ESCOLHA A SUBSTÂNCIA" : "SUBSTÂNCIA DESTA MISSÃO"}
      </p>
      {free ? (
        <>
          <label htmlFor="antacid">Componente do antiácido</label>
          <select
            id="antacid"
            value={selected}
            onChange={(event) => selectAntacid(event.target.value as AntacidId)}
          >
            {Object.entries(ANTACIDS).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            ))}
          </select>
          <p className="small">Trocar a substância reinicia o experimento.</p>
        </>
      ) : (
        <h3 className="chemical-name">{chemical.name}</h3>
      )}
      <p className="small">{chemical.note}</p>
      <div className="dose">
        <span>Por adição</span>
        <strong>1 mmol</strong>
        <span>Quantidade didática, não uma dose de medicamento</span>
      </div>
      <button
        className="primary"
        disabled={solved || state.acid === 0 || (!free && prediction === null)}
        onClick={addAntacid}
      >
        {state.acid === 0 ? "HCl inicial consumido" : "+ Adicionar antiácido"}
      </button>
      {!free && prediction === null && (
        <p className="small">Responda à previsão acima para começar.</p>
      )}
      {!free && (
        <button
          className="verify-button"
          disabled={solved || prediction === null}
          onClick={verify}
        >
          Conferir minha reação
        </button>
      )}
      <button className="secondary" disabled={solved} onClick={resetExperiment}>
        {free ? "Reiniciar experimento" : "Reiniciar tentativa"}
      </button>
      <p className="dose-count">
        {state.additions}{" "}
        {state.additions === 1 ? "adição realizada" : "adições realizadas"}
      </p>
      <div className="observation">
        <p className="eyebrow">OBSERVE A REAÇÃO</p>
        <p>
          {state.additions === 0
            ? "Adicione a substância para iniciar a reação."
            : `Cada adição consome ${chemical.capacity} mmol de HCl. ${chemical.gas ? "Também há formação de CO₂." : "Forma-se sal e água, sem produção de CO₂."}`}
        </p>
      </div>
    </div>
  );
}
