import { describe, test } from "node:test";
import assert from "node:assert";
import { quickSort, getMedianPivot } from "../../src/sorting/quickSort";
import { generateRandomArray } from "../utils";
import { type Comparator } from "../../src/types/comparator";
import { defaultComparator } from "../../src/sorting/comparator";

describe("getMedianPivot", () => {
  test("return the median", () => {
    assert.equal(getMedianPivot([1, 2, 3], defaultComparator), 2);
  });
  test("return the median", () => {
    assert.equal(getMedianPivot([1, 2, 3, 4, 5, 6], defaultComparator), 4);
  });
});

describe("quickSort with default comparator and numbers", () => {
  test("sorts an unsorted array", () => {
    assert.deepStrictEqual(quickSort([1, 3, 2]), [1, 2, 3]);
  });
  test("doesn't change already sorted array", () => {
    assert.deepStrictEqual(quickSort([1, 2, 3]), [1, 2, 3]);
  });
  test("sorts reverse array", () => {
    assert.deepStrictEqual(quickSort([3, 2, 1]), [1, 2, 3]);
  });
  test("sorts array with duplicates", () => {
    assert.deepStrictEqual(quickSort([3, 3, 3, 2, 1, 1]), [1, 1, 2, 3, 3, 3]);
  });
  test("returns an empty array when argument is an empty array", () => {
    assert.deepStrictEqual(quickSort([]), []);
  });
  test("returns a one element array when argument is on element array", () => {
    assert.deepStrictEqual(quickSort([1]), [1]);
  });
  test("sorts negative numbers", () => {
    assert.deepStrictEqual(quickSort([-1, -3, -2]), [-3, -2, -1]);
  });
  test("sorts mixed values", () => {
    assert.deepStrictEqual(quickSort([-1, 3, -2]), [-2, -1, 3]);
  });
  test("doesn't change original array (immutability)", () => {
    const arr = [1, 3, 2];
    quickSort(arr);
    assert.deepStrictEqual(arr, [1, 3, 2]);
  });
});

describe("quickSort with random numbers", () => {
  const seeds = [1, 42, 123, 999, 1001];
  const lengths = [5, 10, 20];

  seeds.forEach((seed) => {
    lengths.forEach((length) => {
      test(`sorts a random array of length ${length} with seed ${seed}`, () => {
        const randomArr = generateRandomArray(length, seed);
        assert.deepStrictEqual(
          quickSort(randomArr),
          randomArr.sort((a, b) => a - b),
        );
      });
    });
  });
});

describe("quickSort with custom comparator", () => {
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
    assert.deepStrictEqual(quickSort([older, younger], compareByAge), [younger, older]);
  });
  test("doesn't change already sorted array", () => {
    assert.deepStrictEqual(quickSort([younger, older], compareByAge), [younger, older]);
  });
  test("returns an empty array when argument is an empty array", () => {
    assert.deepStrictEqual(quickSort<Person>([], compareByAge), []);
  });
  test("returns a one element array when argument is one element array", () => {
    assert.deepStrictEqual(quickSort([younger], compareByAge), [younger]);
  });
  // stability test
  test("maintains order of equal elements", () => {
    const person1: Person = { name: "Alice", age: 25 }; // age equal to bob's
    const person2: Person = { name: "Charlie", age: 30 };
    const person3: Person = { name: "Bob", age: 25 }; // age equal to Alice's
    assert.deepStrictEqual(quickSort([person1, person2, person3], compareByAge), [
      person1,
      person3,
      person2,
    ]);
  });
  test("sorts larger array of people but different", () => {
    const person1: Person = { name: "Alice", age: 25 }; // age equal to bob's
    const person2: Person = { name: "Charlie", age: 30 };
    const person3: Person = { name: "Bob", age: 24 }; // age equal to Alice's
    const person4: Person = { name: "Diana", age: 24 }; // age equal to Alice's
    const person5: Person = { name: "Eve", age: 19 }; // age equal to Alice's
    assert.deepStrictEqual(quickSort([person1, person2, person3, person4, person5], compareByAge), [
      person5,
      person3,
      person4,
      person1,
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
    assert.deepStrictEqual(quickSort(people, compareByAge), sortedPeople);
  });
});
