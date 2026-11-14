import test from "node:test";
import assert from "node:assert/strict";
import "../assets/js/cosmo-formula-engine.js";
const E = globalThis.CosmoFormulaEngine;

test("kinetic energy evaluates to 9 joules", () => {
  const r = E.evaluate("0.5*m*v^2", {m:{value:2,unit:"kg"},v:{value:3,unit:"m/s"}}, "J");
  assert.ok(Math.abs(r.value - 9) < 1e-10);
});
test("compatible addition converts centimetres to metres", () => {
  const r = E.evaluate("a+b", {a:{value:1,unit:"m"},b:{value:20,unit:"cm"}}, "m");
  assert.ok(Math.abs(r.value - 1.2) < 1e-10);
});
test("dimensionally incompatible addition is rejected", () => {
  assert.throws(() => E.evaluate("a+b", {a:{value:1,unit:"m"},b:{value:1,unit:"s"}}, "m"));
});
test("division by zero is rejected", () => {
  assert.throws(() => E.evaluate("a/0", {a:{value:2,unit:"1"}}, "1"));
});
test("unknown functions and characters are rejected", () => {
  assert.throws(() => E.parse("fetch(1)"));
  assert.throws(() => E.parse("1;alert(1)"));
});
test("unit mismatch is rejected", () => {
  assert.throws(() => E.evaluate("a", {a:{value:2,unit:"m"}}, "s"));
});
test("Celsius to kelvin conversion handles affine offset", () => {
  assert.ok(Math.abs(E.convert(0,"degC","K") - 273.15) < 1e-10);
});
test("affine temperatures cannot be naively added", () => {
  assert.throws(() => E.evaluate("t+1", {t:{value:20,unit:"degC"}}, "K"));
});
test("missing variables and empty function calls are rejected", () => {
  assert.throws(() => E.evaluate("x+1", {}, "1"));
  assert.throws(() => E.parse("sqrt()"));
});
test("standard exponent precedence and negative powers work", () => {
  assert.equal(E.evaluate("-2^2", {}, "1").value, -4);
  assert.equal(E.evaluate("2^-2", {}, "1").value, 0.25);
});
test("negative square roots and non-finite outputs are rejected", () => {
  assert.throws(() => E.evaluate("sqrt(-1)", {}, "1"));
  assert.throws(() => E.evaluate("exp(1000)", {}, "1"));
});
