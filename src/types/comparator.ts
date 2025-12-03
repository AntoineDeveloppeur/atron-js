/**
 * Type representing the possible return values for a comparison function.
 * - `-1` if a < b
 * - `0` if a === b
 * - `1` if a > b
 */

export type ComparatorResult = -1 | 0 | 1;

/**
 * Provide a Comparator Type to build custom comparator
 *
 * Example
 * ```ts
 * import { defaultComparator, type Comparator } from 'atron-js'
 *
 * interface Person {
 *   name: string;
 *   age: number;
 * }
 *
 * //defines custom comparator based on age property of a Person type object
 * const compareByAge: Comparator<Person> = (a: Person, b: Person) =>
 *   a.age === b.age ? 0 : a.age < b.age ? -1 : 1;
 *
 * // test with two people
 * const younger: Person = { name: "Maria", age: 18 };
 * const older: Person = { name: "John", age: 23 };
 * compareByAge(younger, older); // -1
 * ```
 *
 * @param a - The first variable to compare
 * @param b - The second variable to compare
 * @returns {ComparatorResult} A value which describe relative position of parameters
 */

export type Comparator<T> = (a: T, b: T) => ComparatorResult;

/*
 * Type allowed in the default Comparator
 */

export type DefaultComparable = number | string | bigint;
