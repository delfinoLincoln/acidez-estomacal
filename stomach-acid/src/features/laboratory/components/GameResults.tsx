interface Props {
  score: number;
  onRestart: () => void;
}
export default function GameResults({ score, onRestart }: Props) {
  return (
    <section className="results">
      <p className="eyebrow">INVESTIGAÇÃO CONCLUÍDA</p>
      <h1>
        Você fez a <em>química acontecer.</em>
      </h1>
      <p className="result-score">
        {score}
        <span> / 450 pontos</span>
      </p>
      <h2>O que as três missões mostram?</h2>
      <p>
        Mg(OH)₂ e CaCO₃ consomem 2 mmol de HCl por mmol de substância. NaHCO₃
        consome 1. Os sais carbonato e bicarbonato liberam CO₂; o hidróxido de
        magnésio não produz esse gás.
      </p>
      <p>
        A comparação usa a mesma quantidade em mol, não a mesma massa. E nenhum
        desses resultados indica qual medicamento uma pessoa deve tomar.
      </p>
      <div className="result-actions">
        <button className="primary" onClick={onRestart}>
          Jogar novamente
        </button>
        <a className="start-link" href="#livre">
          Explorar livremente →
        </a>
      </div>
    </section>
  );
}
