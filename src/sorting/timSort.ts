import { Comparator, DefaultComparable } from "../types/comparator";
import { defaultComparator } from "./comparator";
import { deepClone } from "../utils/object";

/**
 * Sorts an array using a TimSort-like strategy:
 * 1) split the array into fixed-size runs (`run`)
 * 2) sort each run with insertion sort
 * 3) iteratively merge sort runs (doubling the merged size each pass)
 *
 * This implementation is **pure**: it does **not** mutate the input array.
 * It clones the input via `deepClone` and sorts the clone.
 *
 * if there is no comparator function provided, default comparator is used.
 * default comparator only accepts number | string | bigint
 *
 * @Example with default comparator
 * ```ts
 * import { timSort } from 'atron-js'
 *
 * timSort([1,3,2,0]); // [0,1,2,3]
 * timSort(["b", "d", "c", "a"]); // ["a","b","c","d"]
 *
 * ```
 * For other types, a custom comparator must be provided as the second argument
 * To help you create your custom comparator, check the function type here: src/types/comparator.ts
 *
 * @Example with custom comparator
 * ```ts
 * import { timSort, type Comparator } from 'atron-js'
 *
 * interface Person {
 *   name: string;
 *   age: number;
 * }
 *
 * // defines custom comparator based on age property of a Person type object
 * const compareByAge: Comparator<Person> = (a: Person, b: Person) =>
 *   a.age === b.age ? 0 : a.age < b.age ? -1 : 1;
 *
 * // with two people
 * const younger: Person = { name: "Maria", age: 18 };
 * const older: Person = { name: "John", age: 23 };
 * timSort([older, younger], compareByAge);// [younger, older]
 * ```
 * @param {T[]} array - Input array to sort.
 * @param {Comparator<T>} cmp - Comparator used to order elements. Must return:
 * - a negative number if `a < b`
 * - `0` if `a === b`
 * - a positive number if `a > b`
 * Defaults to `defaultComparator`.
 * @returns A new sorted array (the input array is left unchanged).
 *
 * @remarks
 * - This is not a full TimSort (no natural run detection, no run stack invariants, no galloping mode, and no advanced merge/memory optimizations)
 * - The algorithm is **stable**
 *
 * @complexity
 * - Time:
 *   - Best-case: `O(n)` when the array is already (or almost) sorted, because insertion-sort on
 *     each small run is linear and merges are close to linear.
 *   - Average-case: `O(n log n)` when the array is randomly ordered.
 *   - Worst-case: `O(n log n)` when the array is sorted in reverse order.
 * - Space: `O(n)` additional space due to temporary arrays during merge, plus the clone.
 */
export function timSort(array: DefaultComparable[]): DefaultComparable[];
export function timSort<T>(array: T[], cmp: Comparator<T>): T[];
export function timSort<T = number>(array: T[], cmp?: Comparator<T>): T[] {
  const compareFn = cmp ?? (defaultComparator as Comparator<T>);
  const arr = deepClone(array);
  const n = arr.length;
  const run = 32;

  // Step 1: Sort small runs using Insertion Sort
  for (let i = 0; i < n; i += run) {
    insertionSort(arr, i, Math.min(i + run - 1, n - 1), compareFn);
  }

  // Step 2: Merge sorted runs using Merge Sort
  // Merge the sorted runs using a bottom-up merge sort strategy.
  // Each pass merges adjacent runs of size `size`, producing sorted blocks of size `2 * size`.
  // The run size doubles on every pass until the whole array is merged into a single sorted block.
  for (let size = run; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = Math.min(left + size - 1, n - 1);
      const right = Math.min(left + 2 * size - 1, n - 1);
      if (mid < right) {
        merge(arr, left, mid, right, compareFn);
      }
    }
  }
  return arr;
}

/**
 * Merges sort two consecutive sorted sub-arrays.
 *
 * @param {T[]} arr - Array being sorted.
 * @param {number} left - Start index of the left run (inclusive).
 * @param {number} mid - End index of the left run (inclusive). The right run starts at `mid + 1`.
 * @param {number} right - End index of the right run (inclusive).
 * @param {Comparator<T>} cmp - Comparator used to order elements.
 * @returns void
 *
 * @remarks
 * This merge is stable because when elements compare equal (`cmp(a, b) <= 0`)
 * the element from the left run is written first.
 */
function merge<T = number>(arr: T[], left: number, mid: number, right: number, cmp: Comparator<T>) {
  let len1 = mid - left + 1;
  let len2 = right - mid;
  let leftArr = new Array(len1);
  let rightArr = new Array(len2);

  for (let i = 0; i < len1; i++) leftArr[i] = arr[left + i];
  for (let i = 0; i < len2; i++) rightArr[i] = arr[mid + 1 + i];

  let i = 0,
    j = 0,
    k = left;
  while (i < len1 && j < len2) {
    if (cmp(leftArr[i], rightArr[j]) <= 0) {
      arr[k] = leftArr[i];
      i++;
    } else {
      arr[k] = rightArr[j];
      j++;
    }
    k++;
  }
  // add remaining elements
  while (i < len1) arr[k++] = leftArr[i++];
  while (j < len2) arr[k++] = rightArr[j++];
}
/**
 * Sorts a slice of array using insertion sort (in-place).
 *
 * @param arr - Array being sorted.
 * @param {T[]} left - Start index (inclusive).
 * @param {number} right - End index (inclusive).
 * @param {Comparator<T>} cmp - Comparator used to order elements.
 * @returns void
 *
 * @remarks
 * Insertion sort is efficient on small ranges and nearly-sorted data, which is why
 * it is used to pre-sort runs before merging.
 */
function insertionSort<T = number>(arr: T[], left: number, right: number, cmp: Comparator<T>) {
  for (let i = left + 1; i <= right; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= left && cmp(arr[j], key) === 1) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}
