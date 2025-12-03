import { describe, test } from "node:test";
import assert from "node:assert";
import { generateRandomArray } from "../utils";
import { type Comparator } from "../../src/types/comparator";
import { mergeAndSortOnce, mergeSort } from "../../src/sorting/mergeSort";
import { defaultComparator } from "../../src/sorting/comparator";

describe("mergeAndSortOnce", () => {
  test("sorts big arrays with last element in the first array", () => {
    assert.deepStrictEqual(
      mergeAndSortOnce([1, 4, 6, 8], [2, 3, 5, 7], defaultComparator),
      [1, 2, 3, 4, 5, 6, 7, 8],
    );
  });
  test("sorts big array  with last element in the second array", () => {
    assert.deepStrictEqual(
      mergeAndSortOnce([2, 3, 5, 7], [1, 4, 6, 8], defaultComparator),
      [1, 2, 3, 4, 5, 6, 7, 8],
    );
  });
  test("sorts odd array length  ", () => {
    assert.deepStrictEqual(
      mergeAndSortOnce([2, 3, 5], [1, 4, 6], defaultComparator),
      [1, 2, 3, 4, 5, 6],
    );
  });
  test("sorts different length array", () => {
    assert.deepStrictEqual(
      mergeAndSortOnce([2], [1, 3, 4, 5, 6], defaultComparator),
      [1, 2, 3, 4, 5, 6],
    );
  });
  test("sorts one element array", () => {
    assert.deepStrictEqual(mergeAndSortOnce([2], [1], defaultComparator), [1, 2]);
  });
  test("sorts with one empty array", () => {
    assert.deepStrictEqual(mergeAndSortOnce([1, 2], [], defaultComparator), [1, 2]);
  });
});

describe("mergeSort with default comparator and numbers", () => {
  test("sorts an unsorted array", () => {
    assert.deepStrictEqual(mergeSort([1, 3, 2]), [1, 2, 3]);
  });
  test("doesn't change already sorted array", () => {
    assert.deepStrictEqual(mergeSort([1, 2, 3]), [1, 2, 3]);
  });
  test("sorts reverse array", () => {
    assert.deepStrictEqual(mergeSort([3, 2, 1]), [1, 2, 3]);
  });
  test("sorts array with duplicates", () => {
    assert.deepStrictEqual(mergeSort([3, 3, 3, 2, 1, 1]), [1, 1, 2, 3, 3, 3]);
  });
  test("returns an empty array when argument is an empty array", () => {
    assert.deepStrictEqual(mergeSort([]), []);
  });
  test("returns a one element array when argument is on element array", () => {
    assert.deepStrictEqual(mergeSort([1]), [1]);
  });
  test("sorts negative numbers", () => {
    assert.deepStrictEqual(mergeSort([-1, -3, -2]), [-3, -2, -1]);
  });
  test("sorts mixed values", () => {
    assert.deepStrictEqual(mergeSort([-1, 3, -2]), [-2, -1, 3]);
  });
  test("doesn't change original array (immutability)", () => {
    const arr = [1, 3, 2];
    mergeSort(arr);
    assert.deepStrictEqual(arr, [1, 3, 2]);
  });
});

describe("mergeSort with random numbers", () => {
  const seeds = [1, 42, 123, 999, 1001];
  const lengths = [5, 10, 20];

  seeds.forEach((seed) => {
    lengths.forEach((length) => {
      test(`sorts a random array of length ${length} with seed ${seed}`, () => {
        const randomArr = generateRandomArray(length, seed);
        assert.deepStrictEqual(
          mergeSort(randomArr),
          randomArr.sort((a, b) => a - b),
        );
      });
    });
  });
});

describe("mergeSort with custom comparator", () => {
  interface Person {
    name: string;
    age: number;
  }

  //defines custom comparator based on age property of a Person type object
  const compareByAge: Comparator<Person> = (a: Person, b: Person) =>
    a.age === b.age ? 0 : a.age < b.age ? -1 : 1;

  // test with two people
  const younger: Person = { name: "Maria", age: 18 };
  const older: Person = { name: "John", age: 23 };
  test("sorts unsorted array", () => {
    assert.deepStrictEqual(mergeSort([older, younger], compareByAge), [younger, older]);
  });
  test("doesn't change already sorted array", () => {
    assert.deepStrictEqual(mergeSort([younger, older], compareByAge), [younger, older]);
  });
  test("returns an empty array when argument is an empty array", () => {
    assert.deepStrictEqual(mergeSort<Person>([], compareByAge), []);
  });
  test("returns a one element array when argument is one element array", () => {
    assert.deepStrictEqual(mergeSort([younger], compareByAge), [younger]);
  });
  // stability test
  test("maintains order of equal elements", () => {
    const person1: Person = { name: "Alice", age: 25 }; // age equal to bob's
    const person2: Person = { name: "Charlie", age: 30 };
    const person3: Person = { name: "Bob", age: 25 }; // age equal to Alice's
    assert.deepStrictEqual(mergeSort([person1, person2, person3], compareByAge), [
      person1,
      person3,
      person2,
    ]);
  });
  test("sorts larger array of people", () => {
    const people: Person[] = [
      { name: "Alice", age: 32 },
      { name: "Bob", age: 24 },
      { name: "Charlie", age: 45 },
      { name: "Diana", age: 24 },
      { name: "Eve", age: 19 },
    ];

    const sortedPeople: Person[] = [
      { name: "Eve", age: 19 },
      { name: "Bob", age: 24 },
      { name: "Diana", age: 24 },
      { name: "Alice", age: 32 },
      { name: "Charlie", age: 45 },
    ];
    assert.deepStrictEqual(mergeSort(people, compareByAge), sortedPeople);
  });
});
