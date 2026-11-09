import { MISSIONS } from "../model/missions";
import type { LaboratoryController } from "../hooks/useLaboratory";
type Props = Pick<
  LaboratoryController,
  "phase" | "mission" | "prediction" | "correctPrediction" | "predict"
>;
export default function MissionChallenge({
  phase,
  mission,
  prediction,
  correctPrediction,
  predict,
}: Props) {
  return (
    <>
      <ol className="mission-steps" aria-label="Progresso">
        {MISSIONS.map((item, index) => (
          <li
            key={item.type}
            aria-current={phase === index ? "step" : undefined}
          >
            <span>{index < phase ? "✓" : `0${index + 1}`}</span>
            {item.label}
          </li>
        ))}
      </ol>
      <div className="prediction">
        <div>
          <p className="eyebrow">ANTES DE ADICIONAR, FAÇA UMA PREVISÃO</p>
          <h2>Quantas adições de 1 mmol você precisa?</h2>
          <p>
            Comece com 12 mmol de HCl e deixe{" "}
            <strong>{mission.target} mmol</strong> restantes.
          </p>
        </div>
        <div>
          <div className="prediction-options">
            {mission.options.map((option) => (
              <button
                key={option}
                disabled={prediction !== null}
                aria-pressed={prediction === option}
                onClick={() => predict(option)}
              >
                {option} adições
              </button>
            ))}
          </div>
          <p className="small" role="status">
            {prediction === null
              ? "Uma previsão por missão. Acertar vale 50 pontos extras."
              : correctPrediction
                ? "Boa previsão! Complete a missão para receber o bônus."
                : `São ${mission.answer} adições. ${mission.explanation} Continue e teste na prática.`}
          </p>
        </div>
      </div>
    </>
  );
}
