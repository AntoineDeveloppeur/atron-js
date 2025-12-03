import test, { describe, mock } from "node:test";
import assert from "node:assert";
import { RandomInt } from "../../../bench/sorting/utils";

describe("get", () => {
  const scale = 40;
  const randomInt = new RandomInt(scale);
  test("returns the bottom part of the scale when Math.random() returns 0", () => {
    mock.method(Math, "random", () => 0);
    assert.equal(randomInt.get(), -scale / 2);
  });
  test("returns the middle part of the scale when Math.random() returns 0.5", () => {
    mock.method(Math, "random", () => 0.5);
    assert.equal(randomInt.get(), 0);
  });
  test("returns the top part of the scale when Math.random() returns 1", () => {
    mock.method(Math, "random", () => 1);
    assert.equal(randomInt.get(), scale / 2);
  });
});
