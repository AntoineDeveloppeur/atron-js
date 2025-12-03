import { describe, test } from "node:test";
import assert from "node:assert";
import { Benchmark } from "../../../bench/sorting/benchmark";
import { quickSort } from "../../../src/sorting/quickSort";
import { mergeSort } from "../../../src/sorting/mergeSort";
import { timSort } from "../../../src/sorting/timSort";

const sortingAlgorithmList = [
  { name: "Quick sort", run: quickSort },
  { name: "Merge sort", run: mergeSort },
  { name: "Tim sort", run: timSort },
];

class MockArrayGenerator {
  static ctorCalls = 0;
  static lastCtorArg: unknown = undefined;

  static randomIntArrCalls = 0;
  static ascendingIntArrCalls = 0;
  static partiallySortedArrCalls = 0;

  randomInt: MockRandomInt;

  constructor(randomInt: MockRandomInt) {
    MockArrayGenerator.ctorCalls += 1;
    MockArrayGenerator.lastCtorArg = randomInt;
    this.randomInt = randomInt;
  }

  randomIntArr(length: number) {
    MockArrayGenerator.randomIntArrCalls += 1;
    return Array.from({ length }, () => 0);
  }

  ascendingIntArr(length: number) {
    MockArrayGenerator.ascendingIntArrCalls += 1;
    return Array.from({ length }, () => 0);
  }

  partiallySortedArr(length: number) {
    MockArrayGenerator.partiallySortedArrCalls += 1;
    return Array.from({ length }, () => 0);
  }
}

class MockRandomInt {
  static ctorCalls = 0;
  static lastCtorArg: unknown = undefined;
  static getCalls = 0;

  range: number;

  constructor(range?: number) {
    MockRandomInt.ctorCalls += 1;
    MockRandomInt.lastCtorArg = range;
    this.range = range ?? 0;
  }

  get() {
    MockRandomInt.getCalls += 1;
    return 0;
  }
}

function resetMockCounters() {
  MockArrayGenerator.ctorCalls = 0;
  MockArrayGenerator.lastCtorArg = undefined;
  MockArrayGenerator.randomIntArrCalls = 0;
  MockArrayGenerator.ascendingIntArrCalls = 0;
  MockArrayGenerator.partiallySortedArrCalls = 0;

  MockRandomInt.ctorCalls = 0;
  MockRandomInt.lastCtorArg = undefined;
  MockRandomInt.getCalls = 0;
}

describe("prepareArrayTypes", () => {
  test("return correct names", () => {
    resetMockCounters();

    const benchmark = new Benchmark(sortingAlgorithmList, MockArrayGenerator, MockRandomInt);
    const arrayTypes = benchmark.prepareArrayTypes();

    assert.equal(arrayTypes[0].name, "randomIntArr");
    assert.equal(arrayTypes[1].name, "partiallySortedArr");
  });

  test("calls randomInt (constructor only)", () => {
    resetMockCounters();

    const benchmark = new Benchmark(sortingAlgorithmList, MockArrayGenerator, MockRandomInt);
    benchmark.prepareArrayTypes();

    assert.equal(MockRandomInt.ctorCalls, 1);
    assert.equal(MockRandomInt.lastCtorArg, 6 * 1e6);

    assert.equal(MockRandomInt.getCalls, 0);
  });

  test("calls arrayGenerator (constructor only) and not its methods until make() is called", () => {
    resetMockCounters();

    const benchmark = new Benchmark(sortingAlgorithmList, MockArrayGenerator, MockRandomInt);
    const arrayTypes = benchmark.prepareArrayTypes();

    assert.equal(MockArrayGenerator.ctorCalls, 1);
    assert.ok(MockArrayGenerator.lastCtorArg instanceof MockRandomInt);

    assert.equal(MockArrayGenerator.randomIntArrCalls, 0);
    assert.equal(MockArrayGenerator.partiallySortedArrCalls, 0);

    arrayTypes[0].make(10);
    assert.equal(MockArrayGenerator.randomIntArrCalls, 1);

    arrayTypes[1].make(10);
    assert.equal(MockArrayGenerator.partiallySortedArrCalls, 1);
  });
});

describe("run", () => {
  test("populates table with correct structure", () => {
    resetMockCounters();
    const benchmark = new Benchmark(sortingAlgorithmList, MockArrayGenerator, MockRandomInt);
    benchmark.run();
    const results = benchmark.getTable();

    assert.ok(results.length > 0);

    const firstLine = results[0];
    assert.ok("Array type" in firstLine);
    assert.ok("length" in firstLine);
    assert.ok("Quick sort time" in firstLine);
    assert.ok("Merge sort time" in firstLine);
    assert.ok("Tim sort time" in firstLine);
  });
  test("calls array generators for each array type and length", () => {
    resetMockCounters();
    const benchmark = new Benchmark(sortingAlgorithmList, MockArrayGenerator, MockRandomInt);
    benchmark.run();
    // lengths = [20, 300, 4000, 50000] => 4 lengths
    // 2 array types (randomIntArr, partiallySortedArr)
    // Total: 4 * 2 = 8 calls (4 for each type)
    assert.equal(MockArrayGenerator.randomIntArrCalls, 4);
    assert.equal(MockArrayGenerator.partiallySortedArrCalls, 4);
  });
  test("generates correct number of result lines", () => {
    resetMockCounters();
    const benchmark = new Benchmark(sortingAlgorithmList, MockArrayGenerator, MockRandomInt);
    benchmark.run();
    const results = benchmark.getTable();

    // 2 array types * 4 lengths = 8 lines
    assert.equal(results.length, 8);
  });
  test("result lines contain correct array type and length", () => {
    resetMockCounters();
    const benchmark = new Benchmark(sortingAlgorithmList, MockArrayGenerator, MockRandomInt);
    benchmark.run();
    const results = benchmark.getTable();

    assert.equal(results[0]["Array type"], "randomIntArr");
    assert.equal(results[0].length, "20");
    assert.equal(results[1]["Array type"], "randomIntArr");
    assert.equal(results[1].length, "300");
    assert.equal(results[2]["Array type"], "randomIntArr");
    assert.equal(results[2].length, "4000");
    assert.equal(results[3]["Array type"], "randomIntArr");
    assert.equal(results[3].length, "50000");

    assert.equal(results[4]["Array type"], "partiallySortedArr");
    assert.equal(results[4].length, "20");
    assert.equal(results[5]["Array type"], "partiallySortedArr");
    assert.equal(results[5].length, "300");
  });
  test("result lines contain time values for all algorithms", () => {
    resetMockCounters();
    const benchmark = new Benchmark(sortingAlgorithmList, MockArrayGenerator, MockRandomInt);
    benchmark.run();
    const results = benchmark.getTable();
    const firstLine = results[0];
    assert.ok(typeof firstLine["Quick sort time"] === "string");
    assert.ok(firstLine["Quick sort time"].includes("ms"));
    assert.ok(typeof firstLine["Merge sort time"] === "string");
    assert.ok(firstLine["Merge sort time"].includes("ms"));
    assert.ok(typeof firstLine["Tim sort time"] === "string");
    assert.ok(firstLine["Tim sort time"].includes("ms"));
  });
});
