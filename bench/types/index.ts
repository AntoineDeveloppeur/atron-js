import { type Comparator } from "../../src/types/comparator";
import { ArrayGenerator, RandomInt } from "../sorting/utils";

export type SortingAlgorithm = <T = number>(arr: T[], cmp?: Comparator<T>) => T[];

export interface sortingAlgorithmList {
  name: string;
  run: <T = number>(arr: T[], cmp?: Comparator<T>) => T[];
}

export type AlgorithmKey = "Quick Sort time" | "Merge Sort time";

export type ResultLine = {
  "Array type": string;
  length: string;
} & Partial<Record<string, string>>;

export type ArrayTypes = Array<{ name: string; make: (length: number) => number[] }>;

export type ArrayGeneratorClass = typeof ArrayGenerator;
export type RandomIntClass = typeof RandomInt;
