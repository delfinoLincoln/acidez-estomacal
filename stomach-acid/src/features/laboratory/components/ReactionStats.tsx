import AcidMeter from "./AcidMeter";
import { INITIAL_ACID } from "../../chemistry/model/reactions";
import type { ReactionState } from "../../chemistry/model/types";

const format = (value: number) =>
  value.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
export default function ReactionStats({ state }: { state: ReactionState }) {
  return (
    <>
      <div className="stats" aria-live="polite" aria-atomic="true">
        <div>
          <span>HCl restante</span>
          <strong>
            {format(state.acid)} <small>mmol</small>
          </strong>
        </div>
        <div>
          <span>Ácido consumido</span>
          <strong>
            {format(((INITIAL_ACID - state.acid) / INITIAL_ACID) * 100)}{" "}
            <small>%</small>
          </strong>
        </div>
        <div>
          <span>CO₂ formado</span>
          <strong>
            {format(state.gas)} <small>mmol</small>
          </strong>
        </div>
      </div>
      <AcidMeter remaining={state.acid} />
    </>
  );
}
