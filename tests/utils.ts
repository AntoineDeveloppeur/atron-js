/**
 *
 * Return an array of pseudo random numbers between -1000 and 1000
 *
 * @param {number} length - length of the array
 * @param {number} seed - number used to generate the same "random number" called pseudo random number
 */

export function generateRandomArray(length: number, seed: number): number[] {
  const random = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  let arr: number[] = [];
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(random(seed + i) * 2000 - 1000));
  }
  return arr;
}
