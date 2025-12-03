import { getFormattedElapsedTime } from "./utils";
import {
  sortingAlgorithmList,
  ResultLine,
  ArrayTypes,
  ArrayGeneratorClass,
  RandomIntClass,
} from "../types";

export class Benchmark {
  private table: Array<ResultLine> = [];
  private algorithms: Array<sortingAlgorithmList>;
  private readonly lengths = [20, 300, 4000, 50000];
  private readonly valueRange = 6 * 1e6;
  ArrayGenerator: ArrayGeneratorClass;
  RandomInt: RandomIntClass;

  constructor(
    algorithms: Array<sortingAlgorithmList>,
    ArrayGenerator: ArrayGeneratorClass,
    RandomInt: RandomIntClass,
  ) {
    this.algorithms = algorithms;
    this.ArrayGenerator = ArrayGenerator;
    this.RandomInt = RandomInt;
  }
  prepareArrayTypes(): ArrayTypes {
    const randomInt = new this.RandomInt(this.valueRange);
    const arrayGenerator = new this.ArrayGenerator(randomInt);
    return [
      { name: "randomIntArr", make: (length: number) => arrayGenerator.randomIntArr(length) },
      {
        name: "partiallySortedArr",
        make: (length: number) => arrayGenerator.partiallySortedArr(length),
      },
    ];
  }
  run(): void {
    const arrayTypes = this.prepareArrayTypes();
    for (const arrayType of arrayTypes) {
      for (const length of this.lengths) {
        const arrToSort = arrayType.make(length);
        const resultLine: ResultLine = { "Array type": arrayType.name, length: String(length) };
        for (const algorithm of this.algorithms) {
          const elapsedTime = getFormattedElapsedTime(algorithm.run, arrToSort);
          const key = `${algorithm.name} time`;
          resultLine[key] = elapsedTime;
        }
        this.table.push(resultLine);
      }
    }
  }

  showResults(): void {
    console.table(this.table);
  }
  getTable(): Array<ResultLine> {
    return this.table;
  }
}
