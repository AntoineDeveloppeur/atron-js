import { describe, test } from "node:test";
import assert from "node:assert";
import { defaultComparator } from "../../src/sorting/comparator";

describe("defaultComparator", () => {
  test("compares numbers correctly", () => {
    assert.equal(defaultComparator(1, 2), -1);
    assert.equal(defaultComparator(2, 1), 1);
    assert.equal(defaultComparator(1, 1), 0);
    assert.equal(defaultComparator(-5, -3), -1);
    assert.equal(defaultComparator(0, -0), 0);
    assert.equal(defaultComparator(1.5, 2.5), -1);
  });

  test("compares lowercase strings correctly", () => {
    assert.equal(defaultComparator("a", "b"), -1);
    assert.equal(defaultComparator("b", "a"), 1);
    assert.equal(defaultComparator("a", "a"), 0);
  });

  test("compares uppercase and lowercase strings correctly", () => {
    assert.equal(defaultComparator("A", "a"), -1); // 'A' < 'a' in ASCII
    assert.equal(defaultComparator("a", "A"), 1);
    assert.equal(defaultComparator("Z", "a"), -1); // 'Z' < 'a' in ASCII
    assert.equal(defaultComparator("banana", "Apple"), 1); // 'b' > 'A'
  });
  test("compares strings with numbers", () => {
    // lexicographical comparison
    assert.equal(defaultComparator("10", "2"), -1);
    assert.equal(defaultComparator("2", "10"), 1);
    assert.equal(defaultComparator("10", "10"), 0);
  });

  test("compares bigints correctly", () => {
    assert.equal(defaultComparator(1n, 2n), -1);
    assert.equal(defaultComparator(2n, 1n), 1);
    assert.equal(defaultComparator(1n, 1n), 0);
    assert.equal(defaultComparator(-5n, -3n), -1);
    assert.equal(defaultComparator(9007199254740993n, 9007199254740992n), 1); // bigger numbers than Number.MAX_SAFE_INTEGER
  });

  test("handles empty strings", () => {
    assert.equal(defaultComparator("", "a"), -1);
    assert.equal(defaultComparator("a", ""), 1);
    assert.equal(defaultComparator("", ""), 0);
  });
});
