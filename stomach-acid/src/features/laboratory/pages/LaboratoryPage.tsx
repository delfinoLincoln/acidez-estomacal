import Sources from "../../../components/Sources";
import Stomach from "../../molecular/components/Stomach";
import ExperimentControls from "../components/ExperimentControls";
import ReactionStats from "../components/ReactionStats";
import MissionChallenge from "../components/MissionChallenge";
import GameResults from "../components/GameResults";
import { useLaboratory } from "../hooks/useLaboratory";

export default function LaboratoryPage({ free = false }: { free?: boolean }) {
  const {
    state,
    phase,
    selected,
    paused,
    prediction,
    score,
    solved,
    complete,
    message,
    mission,
    chemical,
    correctPrediction,
    resetExperiment,
    verify,
    nextMission,
    restartGame,
    addAntacid,
    selectAntacid,
    predict,
    togglePause,
  } = useLaboratory(free);
  if (complete) return <GameResults score={score} onRestart={restartGame} />;
  return (
    <>
      <section className="intro game-heading">
        <div>
          <p className="eyebrow">
            {free
              ? "EXPLORE / COMPARE / REINICIE"
              : `MISSÃO ${phase + 1} DE 3 / DESAFIO DE NEUTRALIZAÇÃO`}
          </p>
          <h1>{free ? "Seu laboratório." : mission.title}</h1>
          <p>
            {free
              ? "Escolha uma substância e acompanhe o consumo de ácido."
              : mission.brief}
          </p>
        </div>
        {!free && (
          <div className="score">
            <span>PONTUAÇÃO</span>
            <strong>
              {score}
              <small> / 450</small>
            </strong>
          </div>
        )}
      </section>
      {!free && (
        <MissionChallenge
          phase={phase}
          mission={mission}
          prediction={prediction}
          correctPrediction={correctPrediction}
          predict={predict}
        />
      )}
      <section className="lab" aria-label="Simulador de neutralização">
        <div className="lab-top">
          <h2>{free ? "Modo livre" : mission.label}</h2>
          <span className="tag">
            {free
              ? "MODELO DIDÁTICO"
              : `META: ${mission.target} mmol DE HCl RESTANTES`}
          </span>
        </div>
        <div className="workspace">
          <div className="visual">
            <div className="visual-top">
              <span>CÂMARA DE REAÇÃO · ESTÔMAGO</span>
              <button
                className="text-button"
                aria-pressed={paused}
                onClick={togglePause}
              >
                {paused ? "Retomar animação" : "Pausar animação"}
              </button>
            </div>
            <Stomach state={state} paused={paused} />
            <div className="legend">
              <span>
                <i className="dot gas" />
                CO₂ formado
              </span>
              <span>
                <i className="dot acid" />
                H⁺ disponível
              </span>
              <span>
                <i className="dot water" />
                H₂O formada
              </span>
            </div>
            <p className="small">
              Cada partícula ou conjunto representa 1 mmol. H⁺ abrevia H₃O⁺ em
              água. Íons espectadores e água já presente não são desenhados.
            </p>
            <ReactionStats state={state} />
          </div>
          <ExperimentControls
            free={free}
            state={state}
            selected={selected}
            chemical={chemical}
            solved={solved}
            prediction={prediction}
            selectAntacid={selectAntacid}
            addAntacid={addAntacid}
            verify={verify}
            resetExperiment={resetExperiment}
          />
        </div>
        <div className="reaction">
          <span>EQUAÇÃO BALANCEADA</span>
          <p>{chemical.equation}</p>
          <small>
            1 mmol da substância : {chemical.capacity} mmol de HCl · (s) sólido
            · (aq) aquoso · (l) líquido · (g) gás
          </small>
        </div>
      </section>
      <div className={`mission-feedback ${solved ? "success" : ""}`}>
        <p role="status">
          {message ||
            (free
              ? "Experimente as três substâncias e compare o número de adições."
              : "Use a equação como pista. Ao chegar à meta, confira sua reação.")}
        </p>
        {solved && (
          <button className="primary" onClick={nextMission}>
            {phase === 2 ? "Ver resultado final →" : "Próxima missão →"}
          </button>
        )}
      </div>
      <p className="model-note">
        <strong>Limites do modelo:</strong> balanço de quantidades com reação
        completa até consumir o HCl disponível. Não calcula pH, solubilidade,
        velocidade da reação ou secreção contínua. Consumir todo o HCl não
        significa pH 7 e não é uma meta de tratamento. As metas do jogo são
        arbitrárias.
      </p>
      <Sources />
    </>
  );
}
