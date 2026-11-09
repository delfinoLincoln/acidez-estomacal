import { useState } from "react";
import { ANTACIDS } from "../../chemistry/model/antacids";
import { initialState, neutralize } from "../../chemistry/model/reactions";
import type { AntacidId } from "../../chemistry/model/types";
import { MISSIONS, isMissionComplete } from "../model/missions";

export function useLaboratory(free: boolean) {
  const [state, setState] = useState(initialState);
  const [phase, setPhase] = useState(0);
  const [selected, setSelected] = useState<AntacidId>("magnesium");
  const [paused, setPaused] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState(false);
  const [complete, setComplete] = useState(false);
  const [message, setMessage] = useState("");
  const mission = MISSIONS[phase];
  const type = free ? selected : mission.type;
  const chemical = ANTACIDS[type];
  const correctPrediction = prediction === mission.answer;

  function resetExperiment() {
    setState(initialState());
    setMessage("Experimento reiniciado.");
  }
  function verify() {
    if (solved) return;
    if (isMissionComplete(state, mission)) {
      setSolved(true);
      setScore((current) => current + 100 + (correctPrediction ? 50 : 0));
      setMessage(
        `Missão concluída! +100 pontos${correctPrediction ? " e +50 pela previsão" : ""}. ${mission.explanation}`,
      );
    } else {
      setMessage(
        state.acid < mission.target
          ? "Você passou da meta. Reinicie a tentativa e use a proporção da equação."
          : `Ainda restam ${state.acid} mmol de HCl. Continue até ${mission.target} mmol.`,
      );
    }
  }
  function nextMission() {
    if (phase === MISSIONS.length - 1) {
      setComplete(true);
      return;
    }
    setPhase((current) => current + 1);
    setState(initialState());
    setPrediction(null);
    setSolved(false);
    setMessage("");
  }
  function restartGame() {
    setPhase(0);
    setState(initialState());
    setPrediction(null);
    setSolved(false);
    setScore(0);
    setComplete(false);
    setMessage("");
  }

  function addAntacid() {
    if (solved || state.acid === 0 || (!free && prediction === null)) return;
    setState(current => neutralize(current, type));
    setMessage("");
  }
  function selectAntacid(value: AntacidId) {
    setSelected(value);
    setState(initialState());
    setMessage("Substância alterada; experimento reiniciado.");
  }
  function predict(value: number) { if (prediction === null) setPrediction(value); }
  function togglePause() { setPaused(value => !value); }
  return {
    state, phase, selected, paused, prediction, score, solved, complete,
    message, mission, chemical, correctPrediction, resetExperiment, verify,
    nextMission, restartGame, addAntacid, selectAntacid, predict, togglePause
  };
}

export type LaboratoryController = ReturnType<typeof useLaboratory>;
