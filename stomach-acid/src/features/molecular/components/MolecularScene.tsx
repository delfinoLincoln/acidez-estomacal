import { createMolecularScene } from "../scene/createMolecularScene";
import type { SceneAPI } from "../scene/createMolecularScene";
import { useEffect, useRef, useState } from "react";
import type { ReactionState } from "../../chemistry/model/types";

type Props = { state: ReactionState; paused?: boolean };
// Three.js cuida da câmera, luz e geometria; a química continua em chemistry.ts.
export default function MolecularScene({ state, paused = false }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<SceneAPI | null>(null);
  const latest = useRef(state);
  const stopped = useRef(paused);
  const [fallback, setFallback] = useState(false);
  const [showShell, setShowShell] = useState(true);
  latest.current = state;
  stopped.current = paused;

  useEffect(() => {
    const scene = createMolecularScene(
      host.current!,
      latest.current,
      () => stopped.current,
      () => setFallback(true),
    );
    api.current = scene;
    return () => {
      api.current = null;
      scene?.dispose();
    };
  }, []);
  useEffect(() => {
    api.current?.update(state);
  }, [state]);
  return (
    <div className="molecular-view">
      <div className="scene-hud">
        <span>
          <i /> VISUALIZAÇÃO 3D
        </span>
        <span>MODELO ESQUEMÁTICO</span>
      </div>
      <div className="scene-canvas" ref={host} data-testid="scene-3d" />
      {fallback && (
        <div className="scene-fallback" role="status">
          <strong>Visualização simplificada</strong>
          <p>
            O 3D não está disponível neste navegador. Você pode continuar o
            experimento pelos controles e resultados.
          </p>
          <p>
            {state.acid} mmol de HCl · {state.water} mmol de H₂O · {state.gas}{" "}
            mmol de CO₂
          </p>
        </div>
      )}
      <div className="scene-toolbar" aria-label="Controles da câmera">
        <button
          disabled={fallback}
          onClick={() => api.current?.zoom(0.85)}
          aria-label="Aproximar câmera"
        >
          +
        </button>
        <button
          disabled={fallback}
          onClick={() => api.current?.zoom(1.15)}
          aria-label="Afastar câmera"
        >
          −
        </button>
        <button disabled={fallback} onClick={() => api.current?.rotate()}>
          Girar
        </button>
        <button disabled={fallback} onClick={() => api.current?.reset()}>
          Restaurar vista
        </button>
        <button
          disabled={fallback}
          aria-pressed={!showShell}
          onClick={() => {
            setShowShell(!showShell);
            api.current?.shell(!showShell);
          }}
        >
          Só partículas
        </button>
      </div>
      <p className="scene-hint">
        Arraste para girar · role para aproximar · cores e tamanhos ilustrativos
      </p>
    </div>
  );
}
