import { describe, test } from "node:test";
import assert from "node:assert";
import { formatElapsedTime, getFormattedElapsedTime } from "../../../bench/sorting/utils";

const duration = 500; // milliseconds

describe("formatElapsedTime", () => {
  const durationInNanoseconds = BigInt(duration * 1e6);
  test("return a result in ms", () => {
    const formattedTime = formatElapsedTime(durationInNanoseconds);
    const unit = formattedTime.slice(-2);
    assert.equal(unit, "ms");
  });
  test(`return ${duration} ms`, () => {
    assert.equal(formatElapsedTime(durationInNanoseconds), `${duration} ms`);
  });
  test(`return 3 significant digits`, () => {
    assert.equal(formatElapsedTime(123456789n), `123 ms`);
  });
  test(`return 3 significant digits`, () => {
    assert.equal(formatElapsedTime(100000000n), `100 ms`);
  });
  test(`return 3 significant digits`, () => {
    assert.equal(formatElapsedTime(1000000n), `1.00 ms`);
  });
  test(`return 3 significant digits`, () => {
    assert.equal(formatElapsedTime(123456n), `0.123 ms`);
  });
});

describe("getFormattedElapsedTime", () => {
  const wait = (time: number) => {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, time);
  };
  test("return a result in ms", () => {
    const formattedElapsedTime = getFormattedElapsedTime(wait, duration);
    const unit = formattedElapsedTime.slice(-2);
    assert.equal(unit, "ms");
  });
  test(`return a result close to ${duration} ms`, () => {
    const formattedElapsedTime = getFormattedElapsedTime(wait, duration);
    const ms = Number(formattedElapsedTime.replace(" ms", ""));
    const tolerance = 100; // 100 ms to be sure test works in all environments including CI
    assert.ok(ms >= duration && ms <= duration + tolerance);
  });
});
