import test from "node:test";
import assert from "node:assert/strict";
import { initialState, neutralize } from "../../src/features/chemistry/model/reactions.ts";
import type { AntacidId } from "../../src/features/chemistry/model/types.ts";
import { MISSIONS, isMissionComplete } from "../../src/features/laboratory/model/missions.ts";

test("Mg(OH)2 consome dois HCl e forma duas águas, sem gás", () => {
  const initial = initialState();
  assert.deepEqual(neutralize(initial, "magnesium"), {
    acid: 10,
    additions: 1,
    water: 2,
    gas: 0,
  });
  assert.equal(initial.acid, 12, "não altera o estado anterior");
});
test("carbonato e bicarbonato têm proporções diferentes", () => {
  assert.deepEqual(neutralize(initialState(), "calcium"), {
    acid: 10,
    additions: 1,
    water: 1,
    gas: 1,
  });
  assert.deepEqual(neutralize(initialState(), "sodium"), {
    acid: 11,
    additions: 1,
    water: 1,
    gas: 1,
  });
});
test("o ácido limita a reação e não fica negativo", () => {
  const result = neutralize(
    { acid: 1, additions: 0, gas: 0, water: 0 },
    "calcium",
  );
  assert.deepEqual(result, { acid: 0, additions: 1, water: 0.5, gas: 0.5 });
  assert.deepEqual(neutralize(result, "calcium"), result);
});
test("todas as missões têm metas alcançáveis e respostas corretas", () => {
  for (const mission of MISSIONS) {
    let state = initialState();
    assert.equal(isMissionComplete(state, mission), false);
    for (let i = 0; i < mission.answer; i++)
      state = neutralize(state, mission.type);
    assert.equal(isMissionComplete(state, mission), true);
    assert.equal(
      isMissionComplete(neutralize(state, mission.type), mission),
      false,
    );
  }
});
test("modo livre termina em seis ou doze adições e não gera produtos extras", () => {
  for (const [type, count, gas, water] of [
    ["magnesium", 6, 0, 12],
    ["calcium", 6, 6, 6],
    ["sodium", 12, 12, 12],
  ] as [AntacidId, number, number, number][]) {
    let state = initialState();
    for (let i = 0; i < 30; i++) state = neutralize(state, type);
    assert.deepEqual(state, { acid: 0, additions: count, gas, water });
  }
});
