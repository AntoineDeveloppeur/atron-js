import { Comparator, DefaultComparable } from "../types/comparator";
import { defaultComparator } from "./comparator";

/**
 * Sorts an array using a Quick Sort strategy:
 * 1) choose a pivot (here: median-of-three)
 * 2) partition elements into `less`, `equal` (pivot values), and `greater`
 * 3) recursively quick sort `less` and `greater`, then concatenate the results
 *
 * This implementation is **pure**: it does **not** mutate the input array.
 * It returns a new sorted array (built from newly allocated partitions).
 *
 * If there is no comparator function provided, the default comparator is used.
 * The default comparator only accepts `number | string | bigint`.
 *
 * @Example with default comparator
 * ```ts
 * import { quickSort } from "atron-js";
 *
 * quickSort([1, 3, 2, 0]); // [0, 1, 2, 3]
 * quickSort(["b", "d", "c", "a"]); // ["a", "b", "c", "d"]
 * ```
 *
 * For other types, a custom comparator must be provided as the second argument.
 * To help you create your custom comparator, check the function type here: src/types/comparator.ts
 *
 * @Example with custom comparator
 * ```ts
 * import { quickSort, type Comparator } from "atron-js";
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
 * quickSort([older, younger], compareByAge); // [younger, older]
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
 * - This implementation uses a median-of-three pivot to reduce the likelihood
 *   of worst-case partitions on partially sorted inputs.
 * - The algorithm is **not stable** in general (the relative order of equal elements is not guaranteed).
 *
 * @complexity
 * - Time:
 *   - Best-case: `O(n log n)` (balanced partitions).
 *   - Average-case: `O(n log n)`.
 *   - Worst-case: `O(n^2)` (highly unbalanced partitions).
 * - Space: `O(n)` due to allocating partition arrays (`less`, `greater`, `pivotValues`) and recursion overhead.
 */
export function quickSort(arr: DefaultComparable[]): DefaultComparable[];
export function quickSort<T>(arr: T[], cmp: Comparator<T>): T[];
export function quickSort<T = number>(arr: T[], cmp?: Comparator<T>): T[] {
  const compareFn = cmp ?? (defaultComparator as Comparator<T>);
  if (arr.length < 2) return arr;

  const pivot = getMedianPivot(arr, compareFn);
  let less: T[] = [];
  let greater: T[] = [];
  let pivotValues: T[] = [];

  // put all less element left and all greater element in a new array
  for (const element of arr) {
    if (compareFn(element, pivot) === -1) {
      less.push(element);
    } else if (compareFn(element, pivot) === 0) {
      pivotValues.push(element);
    } else greater.push(element);
  }
  // recursively quick sort less and greater
  return [...quickSort(less, compareFn), ...pivotValues, ...quickSort(greater, compareFn)];
}

/**
 * Returns the median-of-three pivot value taken from:
 * - the first element
 * - the middle element
 * - the last element
 *
 * This strategy helps reduce the likelihood of highly unbalanced partitions compared to always
 * picking the first/last element as pivot.
 *
 * @param {T[]} arr - Input array used to compute the pivot (must contain at least 1 element).
 * @param {Comparator<T>} cmp - Comparator used to order elements. Must return:
 * - a negative number if `a < b`
 * - `0` if `a === b`
 * - a positive number if `a > b`
 * Defaults to `defaultComparator`.
 * @returns {T} The median value among (first, middle, last) according to `cmp`.
 */
export function getMedianPivot<T = number>(arr: T[], cmp: Comparator<T>): T {
  const first = arr[0];
  const mid = arr[Math.floor(arr.length / 2)];
  const last = arr[arr.length - 1];

  // Sort the three values and return the middle one
  const sorted = [first, mid, last].sort(cmp);
  return sorted[1];
}
