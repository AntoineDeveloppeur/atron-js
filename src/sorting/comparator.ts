import { type DefaultComparable, type Comparator } from "../types/comparator";
/**
 * Returns a number which represent compare of value to another
 * Compares numbers, strings and bigints.
 *
 * Example with default comparator
 * ```ts
 * import { defaultComparator } from 'atron-js'
 *
 * defaultComparator(3, 2); // 1
 * defaultComparator(2, 2); // 0
 * defaultComparator(2, 3); // -1
 * ```
 * String Comparison Behavior:
 * - Case-sensitive: Uppercase letters are considered "less than" lowercase
 *   - Example: 'A' < 'a' (true), 'Z' < 'a' (true)
 *   - Example: defaultComparator("Banana", "apple") // -1 ('B' < 'a')
 *
 * - Lexicographical order for numeric strings:
 *   - Example: "10" < "2" (true, because '1' < '2')
 *   - This is different from numeric comparison where 10 > 2
 *
 * @param {DefaultComparable} a - The value to compare to b
 * @param {DefaultComparable} b - The value to compare to a
 * @returns {ComparatorResult} A value which describe relative position of parameters
 * @throws {TypeError} If a and b are of different types
 */

export const defaultComparator: Comparator<DefaultComparable> = (a, b) =>
  a === b ? 0 : a < b ? -1 : 1;
