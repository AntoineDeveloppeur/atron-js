import { DefaultComparable, type Comparator } from "../types/comparator";
import { defaultComparator } from "./comparator";
import { deepClone } from "../utils/object";

/**
 * Sorts an array using the Bubble Sort algorithm:
 * 1) repeatedly traverse the array
 * 2) swap adjacent out-of-order elements
 * 3) stop early if a full pass performs no swap
 *
 * This implementation is **pure**: it does **not** mutate the input array.
 * It clones the input via `deepClone` and sorts the clone.
 *
 * If there is no comparator function provided, the default comparator is used.
 * The default comparator only accepts `number | string | bigint`.
 *
 * @Example with default comparator
 * ```ts
 * import { bubbleSort } from "atron-js";
 *
 * bubbleSort([1, 3, 2, 0]); // [0, 1, 2, 3]
 * bubbleSort(["b", "d", "c", "a"]); // ["a", "b", "c", "d"]
 * ```
 *
 * For other types, a custom comparator must be provided as the second argument.
 * To help you create your custom comparator, check the function type here: src/types/comparator.ts
 *
 * @Example with custom comparator
 * ```ts
 * import { bubbleSort, type Comparator } from "atron-js";
 *
 * interface Person {
 *   name: string;
 *   age: number;
 * }
 *
 * // Defines a custom comparator based on the age property of a Person object
 * const compareByAge: Comparator<Person> = (a: Person, b: Person) =>
 *   a.age === b.age ? 0 : a.age < b.age ? -1 : 1;
 *
 * const younger: Person = { name: "Maria", age: 18 };
 * const older: Person = { name: "John", age: 23 };
 * bubbleSort([older, younger], compareByAge); // [younger, older]
 * ```
 *
 * @param {T[]} arr - Input array to sort.
 * @param {Comparator<T>} cmp - Comparator used to order elements. Must return:
 * - a negative number if `a < b`
 * - `0` if `a === b`
 * - a positive number if `a > b`
 * Defaults to `defaultComparator`.
 * @returns {T[]} A new sorted array (the input array is left unchanged).
 *
 * @remarks
 * - Bubble sort is usually only appropriate for educational purposes or very small arrays.
 * - The algorithm is **stable**
 *
 * @complexity
 * - Time:
 *   - Best-case: `O(n)` when the array is already sorted (early-exit pass with no swap).
 *   - Average-case: `O(n^2)`.
 *   - Worst-case: `O(n^2)`.
 * - Space: `O(n)` due to the clone (the sorting itself is `O(1)` extra space).
 */
export function bubbleSort(arr: DefaultComparable[]): DefaultComparable[];
export function bubbleSort<T>(arr: T[], cmp: Comparator<T>): T[];
export function bubbleSort<T>(arr: T[], cmp?: Comparator<T>): T[] {
  const clonedArray = deepClone(arr);
  const compareFn = cmp ?? (defaultComparator as Comparator<T>);
  let isSwapped = false;
  for (let i = 0; i < arr.length; i++) {
    isSwapped = false;
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (compareFn(clonedArray[j], clonedArray[j + 1]) === 1) {
        [clonedArray[j], clonedArray[j + 1]] = [clonedArray[j + 1], clonedArray[j]];
        isSwapped = true;
      }
    }

    if (!isSwapped) break;
  }

  return clonedArray;
}
