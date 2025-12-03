import { DefaultComparable, type Comparator } from "../types/comparator";
import { defaultComparator } from "./comparator";

/**
 * Sorts an array using the Merge Sort algorithm:
 * 1) recursively split the array into halves until sub-arrays of size 1
 * 2) merge the sorted halves back together
 *
 * This implementation is **pure**: it does **not** mutate the input array.
 * It returns a new sorted array built from slices/merges.
 *
 * If there is no comparator function provided, the default comparator is used.
 * The default comparator only accepts `number | string | bigint`.
 *
 * @Example with default comparator
 * ```ts
 * import { mergeSort } from "atron-js";
 *
 * mergeSort([1, 3, 2, 0]); // [0, 1, 2, 3]
 * mergeSort(["b", "d", "c", "a"]); // ["a", "b", "c", "d"]
 * ```
 *
 * For other types, a custom comparator must be provided as the second argument.
 * To help you create your custom comparator, check the function type here: src/types/comparator.ts
 *
 * @Example with custom comparator
 * ```ts
 * import { mergeSort, type Comparator } from "atron-js";
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
 * mergeSort([older, younger], compareByAge); // [younger, older]
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
 * - The algorithm is **stable**
 *
 * @complexity
 * - Time: `O(n log n)` from worst to best case: mergeSort goes through the same process
 * - Space: `O(n)` additional space due to merging (plus recursion call stack overhead).
 */
export function mergeSort(arr: DefaultComparable[]): DefaultComparable[];
export function mergeSort<T>(arr: T[], cmp: Comparator<T>): T[];
export function mergeSort<T>(arr: T[], cmp?: Comparator<T>): T[] {
  const compareFn = cmp ?? (defaultComparator as Comparator<T>);
  // early stops when trying to divide single Element array
  if (arr.length <= 1) {
    return arr;
  }
  // divide in two arrays
  const half = arr.length / 2;
  const left = arr.slice(0, half); // the first half of the array
  const right = arr.slice(half);

  return mergeAndSortOnce(mergeSort(left, compareFn), mergeSort(right, compareFn), compareFn); // sort the left and right array and call recursively mergeSort until division is complete = there are only single element arrays
}

/**
 * Merges two consecutive sorted arrays into a single sorted array.
 *
 * The returned array is sorted **if and only if** both input arrays are sorted according to `cmp`.
 * This function does **not** mutate `left` or `right`.
 *
 * @param {T[]} left - Left sorted array
 * @param {T[]} right - Right sorted array
 * @param {Comparator<T>} cmp - Comparator used to order elements. Must return:
 * - a negative number if `a < b`
 * - `0` if `a === b`
 * - a positive number if `a > b`
 * Defaults to `defaultComparator`.
 * @returns {T[]} A new array containing all elements from `left` and `right`, in sorted order
 */
// export function mergeAndSortOnce(
//   left: DefaultComparable[],
//   right: DefaultComparable[],
// ): DefaultComparable[];
// export function mergeAndSortOnce<T>(left: T[], right: T[], cmp: Comparator<T>): T[];
// export function mergeAndSortOnce<T>(left: T[], right: T[], cmp?: Comparator<T>): T[] {

export function mergeAndSortOnce<T>(left: T[], right: T[], cmp: Comparator<T>): T[] {
  let leftIndex = 0;
  let rightIndex = 0;
  const sorted: T[] = [];
  while (leftIndex < left.length && rightIndex < right.length) {
    if (cmp(left[leftIndex], right[rightIndex]) <= 0) {
      sorted.push(left[leftIndex]);
      leftIndex++;
    } else {
      sorted.push(right[rightIndex]);
      rightIndex++;
    }
  }
  return sorted.concat(left.slice(leftIndex), right.slice(rightIndex)); // in case array's length is odd
}
