import { INITIAL_ACID } from "../../chemistry/model/reactions";
import "./AcidMeter.css";
interface Props {
  remaining: number;
  target?: number;
}
export default function AcidMeter({ remaining, target }: Props) {
  const consumed = INITIAL_ACID - remaining;
  return (
    <div className="acid-meter">
      <div className="meter-caption">
        <span>CONSUMO DE ÁCIDO</span>
        <span>
          {target === undefined
            ? "Quantidade em mmol"
            : `Meta: consumir ${INITIAL_ACID - target} mmol`}
        </span>
      </div>
      <div
        className="meter-track"
        role="progressbar"
        aria-label="HCl consumido"
        aria-valuemin={0}
        aria-valuemax={INITIAL_ACID}
        aria-valuenow={consumed}
        aria-valuetext={`${consumed} de ${INITIAL_ACID} mmol consumidos`}
      >
        {Array.from({ length: INITIAL_ACID }, (_, i) => (
          <span key={i} className={i < consumed ? "filled" : ""} />
        ))}
        {target !== undefined && (
          <i
            className="meter-target"
            style={{
              left: `${((INITIAL_ACID - target) / INITIAL_ACID) * 100}%`,
            }}
            aria-hidden="true"
          />
        )}
      </div>
      <div className="meter-labels">
        <span>0 mmol</span>
        <strong>{consumed} mmol consumidos</strong>
        <span>{INITIAL_ACID} mmol</span>
      </div>
    </div>
  );
}
