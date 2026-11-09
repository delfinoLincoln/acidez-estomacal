import { lazy, Suspense } from "react";
import type { ReactionState } from "../../chemistry/model/types";
const MolecularScene = lazy(() => import("./MolecularScene"));

export default function Stomach(props: {
  state: ReactionState;
  paused?: boolean;
}) {
  return (
    <Suspense
      fallback={<div className="scene-loading">Carregando cena 3D...</div>}
    >
      <MolecularScene {...props} />
    </Suspense>
  );
}
