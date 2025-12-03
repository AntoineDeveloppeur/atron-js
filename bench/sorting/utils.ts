/**
 * Return a duration in milliseconds with 'ms' at then of the string
 *
 * @param {bigint} time - duration to format in nanoseconds
 * @returns {string} - duration in milliseconds with 3 significant digits
 */

export function formatElapsedTime(time: bigint): string {
  const milliseconds = Number(time) / 1e6;
  return `${milliseconds.toPrecision(3)} ms`;
}

/**
 * Return the elapsed time for a given synchronous function
 *
 * @param fn - function to measure elapsed time
 * @returns {string} - time in milliseconds
 */
export function getFormattedElapsedTime<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  ...args: Args
): string {
  const start = process.hrtime.bigint();
  fn(...args);
  const end = process.hrtime.bigint();
  return formatElapsedTime(end - start);
}

export class ArrayGenerator {
  randomInt: RandomInt;
  /**
   * Generates an array of random integers.
   * @param n - The length of the array to generate.
   * @returns An array of random integers.
   */
  constructor(randomInt: RandomInt) {
    this.randomInt = randomInt;
  }
  randomIntArr(n: number): number[] {
    const arr: number[] = new Array(n);
    for (let i = 0; i < n; i++) {
      arr[i] = this.randomInt.get();
    }
    return arr;
  }

  /**
   * Generates an array of integers in ascending order.
   * @param n - The length of the array to generate.
   * @returns An array of integers in ascending order.
   */
  ascendingIntArr(n: number): number[] {
    const arr: number[] = new Array(n);
    const start = this.randomInt.get();
    for (let i = 0; i < n; i++) {
      arr[i] = i + start;
    }
    return arr;
  }

  /**
   * Generates an array of  partially-sorted integers
   * @param n - The length of the array to generate.
   * @returns An array of integers with some duplicates.
   */
  partiallySortedArr(n: number): number[] {
    const arr = this.randomIntArr(n);
    if (n < 4) return arr;

    const ascendingChunkSize = Math.floor(Math.sqrt(n));
    const ascendingChunkCount = Math.ceil(ascendingChunkSize / 2);
    for (let i = 0; i < ascendingChunkCount; i++) {
      const ascendingChunk: number[] = this.ascendingIntArr(ascendingChunkSize);
      const randomInsertPosition = Math.floor(Math.random() * n);
      arr.splice(randomInsertPosition, ascendingChunkSize, ...ascendingChunk);
    }
    return arr;
  }
}

export class RandomInt {
  private readonly range: number;
  constructor(range?: number) {
    this.range = range || 20;
  }
  public get(): number {
    return Math.random() * this.range - this.range / 2;
  }
}
