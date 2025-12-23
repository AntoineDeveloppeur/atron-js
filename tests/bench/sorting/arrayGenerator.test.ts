import test, { describe, mock } from "node:test";
import assert from "node:assert";
import { ArrayGenerator } from "../../../bench/sorting/utils";

const mockRandomInt = {
  range: 20,
  get: () => 5,
};

const arrayGenerator = new ArrayGenerator(mockRandomInt);

describe("randomIntArr", () => {
  const length = 3;
  const arr = arrayGenerator.randomIntArr(length);
  test(`returns an array of length of ${length}`, () => {
    assert.equal(arr.length, length);
  });
  test("returns an array with randomIntArr values", () => {
    assert.equal(
      arr.every((element) => element === mockRandomInt.get()),
      true,
    );
  });
});

describe("ascendingIntArr", () => {
  const length = 3;
  const arr = arrayGenerator.ascendingIntArr(length);
  test(`returns an array of length of ${length}`, () => {
    assert.equal(arr.length, length);
  });
  test("returns an array with ascending values", () => {
    assert.equal(
      arr.every((_, index, arr) => {
        if (index === 0) return true;
        return arr[index - 1] < arr[index];
      }),
      true,
    );
  });
});

describe("partiallySortedArr", () => {
  test("returns the same array if length is less than 4", () => {
    const length = 3;

    assert.deepStrictEqual(
      arrayGenerator.partiallySortedArr(length),
      arrayGenerator.randomIntArr(length),
    );
  });
  test("returns an array with at least an ascendant chunk when length  4", () => {
    const length = 4;
    const arr = arrayGenerator.partiallySortedArr(length);
    assert.equal(
      arr.some((_, index, arr) => {
        if (index === 0) return false;
        return arr[index - 1] < arr[index];
      }),
      true,
    );
  });
  test("returns an array with at least an ascendant chunk when length  10", () => {
    const length = 10;
    const arr = arrayGenerator.partiallySortedArr(length);
    assert.equal(
      arr.some((_, index, arr) => {
        if (index === 0) return false;
        return arr[index - 1] < arr[index];
      }),
      true,
    );
  });
  test("return an array of request length", () => {
    const length = 10;
    mock.method(Math, "random", () => 0.99999);
    const arr = arrayGenerator.partiallySortedArr(length);
    assert.equal(arr.length, length);
  });
});
