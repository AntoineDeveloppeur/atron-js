import ArrayGenerator from "./arrayGenerator";
import { Benchmark } from "./benchmark";
import RandomInt from "./randomInt";
import { quickSort } from "../../src/sorting/quickSort";
import { mergeSort } from "../../src/sorting/mergeSort";
import { timSort } from "../../src/sorting/timSort";
import { defaultComparator } from "../../src/sorting/comparator";
import { Comparator } from "../../src/types/comparator";

const jsDefaultSort = <T = number>(
  arr: T[],
  cmp: Comparator<T> = defaultComparator as Comparator<T>,
) => [...arr].sort(cmp);

const sortingAlgorithmList = [
  { name: "Quick sort", run: quickSort },
  { name: "Merge sort", run: mergeSort },
  { name: "Tim sort", run: timSort },
  { name: "Javascript default sort", run: jsDefaultSort },
];
const benchmark = new Benchmark(sortingAlgorithmList, ArrayGenerator, RandomInt);
benchmark.prepareArrayTypes();
benchmark.run();
benchmark.showResults();
