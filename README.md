# atron-js

Utility toolkit for JavaScript & TypeScript.  
`atron-js` gives you a focused set of clear, well-tested helpers for working with strings, numbers, and time in projects of any size.

---

[![Join Community](./assets/discord.svg)](https://discord.gg/xqgmDXgked)

## Features

- **Simple, readable code** – written with clear, explicit logic.
- **TypeScript first** – full type definitions out of the box.
- **Tiny surface area** – a handful of core utilities instead of a huge API.
- **Well-tested** – uses Node's built-in test runner with lots of test cases.

---

## Installation

<details>
<summary>Install</summary>

```bash
npm install atron-js
```

</details>

`atron-js` supports both **ES modules** and **CommonJS** in Node and bundlers.

<details>
<summary>Import examples</summary>

```ts
// ESM / TypeScript
import { tryCatch, getJSON } from "atron-js";

// CommonJS
const { tryCatch, getJSON } = require("atron-js");
```

</details>

Fetch-based helpers (`getJSON`, `postJSON`, etc.) require environments with a
global `fetch` implementation (for example **Node 18+** or modern browsers).

---

## Quick start

### TypeScript / modern JavaScript (ES modules)

<details>
<summary>Quick start code</summary>

```ts
import {
  capitalize,
  reverse,
  isEmpty,
  randomNumber,
  isEven,
  clamp,
  delay,
  formatTime,
  unique,
  chunk,
  shuffle,
  flatten,
} from "atron-js";

console.log(capitalize("hello")); // "Hello"
console.log(reverse("abc")); // "cba"
console.log(isEmpty("   ")); // true

console.log(randomNumber(1, 6)); // e.g. 4
console.log(isEven(10)); // true
console.log(clamp(150, 0, 100)); // 100

console.log(unique([1, 2, 2, 3])); // [1, 2, 3]
console.log(chunk([1, 2, 3, 4, 5], 2)); // [[1, 2], [3, 4], [5]]
console.log(shuffle([1, 2, 3, 4])); // e.g. [3, 1, 4, 2]
console.log(flatten([1, [2, [3, 4]]])); // [1, 2, 3, 4]

await delay(1000);
console.log(formatTime(new Date())); // e.g. "14:05"
```

</details>

## Why `atron-js`?

`atron-js` is designed as a small, focused utility library:

- The implementations are short and readable – you can open the source and understand them quickly.
- The functions do **one clear thing** with sensible, predictable behavior.
- The test suite covers many real-world cases to keep behavior reliable.

Use it for:

- Web and backend applications.
- Scripts, tools, and CLIs.
- Libraries, SDKs, or other shared codebases.

---

## API reference

All functions are exported from the root module:

<details>
<summary>Import pattern</summary>

```ts
import { ... } from "atron-js";
```

</details>

### Error handling

<details>
<summary><strong><code>tryCatch&lt;T&gt;(fn: () =&gt; Promise&lt;T&gt; | T): Promise&lt;[T | null, unknown]&gt;</code></strong></summary>

Wraps a value-returning or promise-returning function and returns a tuple
`[data, error]` instead of throwing.

```ts
import { tryCatch, getJSON } from "atron-js";

const [user, err] = await tryCatch(() => getJSON<User>("/api/user/1"));
if (err) {
  // handle error
} else {
  console.log(user.id);
}
```

</details>

### Arrays

<details>
<summary><strong><code>unique&lt;T&gt;(arr: T[]): T[]</code></strong></summary>

Returns a new array with duplicate values removed.

```ts
unique([1, 2, 2, 3, 3, 3]); // [1, 2, 3]
unique(["a", "b", "a", "c"]); // ["a", "b", "c"]
unique([]); // []
```

**How it works:**

- Uses `Set` to efficiently remove duplicates while preserving order.
</details>

<details>
<summary><strong><code>chunk&lt;T&gt;(arr: T[], size: number): T[][]</code></strong></summary>

Splits an array into smaller fixed-size groups.

```ts
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
chunk([1, 2, 3, 4], 2); // [[1, 2], [3, 4]]
chunk([1, 2, 3], 5); // [[1, 2, 3]]
```

**How it works:**

- The last chunk may contain fewer elements if the array length is not evenly divisible by the chunk size.

</details>

<details>
<summary><strong><code>shuffle&lt;T&gt;(arr: T[]): T[]</code></strong></summary>

Randomizes the order of elements in the array.

```ts
shuffle([1, 2, 3, 4]); // e.g. [3, 1, 4, 2]
shuffle(["a", "b", "c"]); // e.g. ["c", "a", "b"]
```

**How it works:**

- Uses the Fisher-Yates shuffle algorithm to ensure uniform distribution.
- Returns a new array without modifying the original.

</details>

<details>
<summary><strong><code>flatten&lt;T&gt;(arr: any[]): T[]</code></strong></summary>

Flattens nested arrays of any depth into a single-level array.

```ts
flatten([1, [2, [3, 4]]]); // [1, 2, 3, 4]
flatten([
  [1, 2],
  [3, 4],
]); // [1, 2, 3, 4]
flatten([1, 2, 3]); // [1, 2, 3]
```

**How it works:**

- Recursively flattens all nested arrays regardless of nesting depth.

</details>

### Sorting

<details>
<summary><strong>Introduction to sorting</strong></summary>
This library provides **4 sorting algorithms** to handle different use cases and performance requirements.
**Built-in support:** All algorithms work out-of-the-box with `number`, `bigint`, and `string` types.  
**Custom types:** For objects or other data types, provide a custom comparator function (see below).
<details>
<summary><strong>Creating a custom comparator</strong></summary>
A comparator is a function that takes two parameters and returns:
- `-1` if the first value should come before the second
- `0` if they are equal
- `1` if the first value should come after the second

**Example:** Sorting objects by a property

```ts
import { type Comparator } from "atron-js";
interface Person {
  name: string;
  age: number;
}
// Define a comparator based on the age property
const compareByAge: Comparator<Person> = (a: Person, b: Person) =>
  a.age === b.age ? 0 : a.age < b.age ? -1 : 1;
// Usage
const younger: Person = { name: "Maria", age: 18 };
const older: Person = { name: "John", age: 23 };
compareByAge(younger, older); // -1 (Maria comes first)
compareByAge(older, younger); // 1 (John comes after)
compareByAge(younger, younger); // 0 (equal)
```

</details>

The fastest is TimSort.

| Algorithm       | Best    | Average | Worst   | Memory                 | Stable | Method              |
| --------------- | ------- | ------- | ------- | ---------------------- | ------ | ------------------- |
| **Bubble sort** | n       | n²      | n²      | 1                      | Yes    | Exchanging          |
| **Quick sort**  | n log n | n log n | n²      | log n (avg), n (worst) | No     | Partitioning        |
| **Merge sort**  | n log n | n log n | n log n | n                      | Yes    | Merging             |
| **Tim sort**    | n       | n log n | n log n | n                      | Yes    | Insertion & Merging |

</details>

<details>
<summary><strong><code>BubbleSort&lt;T&gt;(arr: T[],cmp?: (a: T,b: T) =>-1 | 0 | 1): T[]</code></strong></summary>

Returns a new array with sorted elements using the bubble sort algorithm

```ts
bubbleSort([1, 3, 2, 0]); // [0,1,2,3]
bubbleSort(["b", "d", "c", "a"]); // ['a','b','c','d']
```

**How it works:**

- Iterate through the array, swap current value and the following one until the end of the array. Repeat until one iteration didn't swap any value.
- Each iteration is coded to be one element shorter than the previous one. This is because last element of previous iteration is for sure the biggest
</details>

<details>
<summary><strong><code>MergeSort&lt;T&gt;(arr: T[],cmp?: (a: T,b: T) =>-1 | 0 | 1): T[]</code></strong></summary>

Returns a new array with sorted elements using the merge sort algorithm

```ts
mergeSort([1, 3, 2, 0]); // [0,1,2,3]
mergeSort(["b", "d", "c", "a"]); // ['a','b','c','d']
```

**How it works:**

- Split the array until they are only one element arrays
- Merge those arrays two by two by comparing each elements
</details>

<details>
<summary><strong><code>QuickSort&lt;T&gt;(arr: T[],cmp?: (a: T,b: T) =>-1 | 0 | 1): T[]</code></strong></summary>

Returns a new array with sorted elements using the quick sort algorithm

```ts
quickSort([1, 3, 2, 0]); // [0,1,2,3]
quickSort(["b", "d", "c", "a"]); // ['a','b','c','d']
```

**How it works:**

- Get a pivot Element with median of three algorithm
- Iterate through the array,
  - push elements with less value than pivot in a "less" array
  - push elements with greater value than pivot in a "more" array
  - push elements with equal value than pivot in a "pivotValues" array
- Merge those arrays
- Repeat iteration on "less" and "more" array
</details>

<details>
<summary><strong><code>TimSort&lt;T&gt;(arr: T[],cmp?: (a: T,b: T) =>-1 | 0 | 1): T[]</code></strong></summary>

Returns a new array with sorted elements using a Tim sort-like algorithm.
This is not a full TimSort (no natural run detection, no run stack invariants, no galloping mode, and no advanced merge/memory optimizations).

```ts
timSort([1, 3, 2, 0]); // [0,1,2,3]
timSort(["b", "d", "c", "a"]); // ['a','b','c','d']
```

**How it works:**

- TimSort is a hybrid sorting algorithm that uses the ideas of Merge Sort and Insertion Sort.
  1.  split the array into fixed-size runs (`run`)
  2.  sort each run with insertion sort (description below)
  3.  iteratively merge sort runs (doubling the merged size each pass)

**What is insertion sort?**
Insertion sort is a simple sorting algorithm that builds the final sorted array one element at a time:

- it iterates from left to right,
- for each element, it “inserts” it into the correct position within the already-sorted left part of the array,
- by shifting larger elements one position to the right.
  It is **very fast on small arrays** and **nearly-sorted data**, which is why TimSort-like implementations typically use it to sort small runs before the merge phase.

**This is not a full TimSort**. A complete TimSort typically includes:

- Natural runs detection
  A “real” TimSort does not necessarily split the array into fixed-size runs. It detects already-ordered runs in the input (ascending or descending sequences). Descending runs are usually reversed so they become ascending, allowing the algorithm to take advantage of existing order in the data.

- Minrun computation
  TimSort computes a `minrun` value (based on `n`) and uses it to decide how runs should be formed/extended. Short runs are extended (typically using insertion sort) until they reach at least `minrun`, instead of using a constant run size such as `run = 32`.

- Run stack + invariants
  A complete TimSort maintains a stack of runs (each run is a pair like `(start, length)`) and does not merge runs “in a fixed pass order”. Instead, after pushing a new run onto the stack, TimSort enforces merge invariants on the run lengths to decide _when_ and _which_ runs to merge, preventing pathological merge orders.

A common way to describe the invariants is to look at the top three runs on the stack:

- `X` = third from the top
- `Y` = second from the top
- `Z` = top run

TimSort repeatedly merges runs until both conditions hold:

- `|X| > |Y| + |Z|`
- `|Y| > |Z|`

If an invariant is violated, TimSort performs a merge near the top of the stack (typically merging either `Y + Z` or `X + Y`, depending on the run sizes) and then checks the invariants again. This dynamic policy keeps merges reasonably balanced and helps guarantee the intended time complexity.

- Advanced merge strategies
  Real-world TimSort implementations use more sophisticated merge routines and policies than a straightforward merge: they may choose different merge directions, apply additional small optimizations, and carefully handle edge cases to improve performance while preserving stability.

- Galloping mode
  During a merge, TimSort can switch to “galloping mode” (exponential search followed by binary search) when one side wins repeatedly. This can significantly speed up merging on partially ordered data by skipping over ranges of elements quickly.

- Memory optimizations
TimSort usually reuses temporary buffers and manages memory more carefully (for example, keeping a reusable merge buffer) instead of allocating new temporary arrays for every merge.
  </details>

### Objects

<details>
<summary><strong><code>deepClone&lt;T&gt;(value: T): T</code></strong></summary>

Creates a deep copy of a value, supporting nested arrays, plain objects, `Date`, and `RegExp`.

```ts
import { deepClone } from "atron-js";

const original = { user: { id: 1 }, date: new Date() };
const copy = deepClone(original);

console.log(original === copy); // false
console.log(original.user === copy.user); // false (nested object is new instance)
```

**Caveats:**

- **Circular references** are not supported.
- Complex types like `Map`, `Set`, or functions are not cloned (they are copied by reference or ignored).

</details>

<details>
<summary><strong><code>deepEqual(a: unknown, b: unknown): boolean</code></strong></summary>

Checks if two values are deeply equal in structure and value. Supports nested objects, arrays, `Date`, and `RegExp`.

```ts
import { deepEqual } from "atron-js";

deepEqual({ a: [1, 2] }, { a: [1, 2] }); // true
deepEqual(new Date("2023-01-01"), new Date("2023-01-01")); // true
deepEqual({ x: 1 }, { x: 2 }); // false
```

</details>

### Functions

<details>
<summary><strong><code>memoize&lt;T&gt;(fn: T, options?: { ttlMs?: number }): T</code></strong></summary>

Wraps a function to cache its results based on the arguments provided. Useful for expensive calculations or repetitive lookups.

```ts
import { memoize } from "atron-js";

// Basic usage
const heavyCalc = (num: number) => {
  console.log("Computing...");
  return num * 2;
};
const cachedCalc = memoize(heavyCalc);

cachedCalc(5); // Logs "Computing...", returns 10
cachedCalc(5); // Returns 10 (no log)

// Usage with Time-To-Live (TTL)
const fetchStatus = memoize(
  async () => {
    return await getJSON("/status");
  },
  { ttlMs: 5000 },
); // Cache expires after 5 seconds
```

**Caveats:**

- Uses `JSON.stringify` internally to generate cache keys. This means `{ a: 1, b: 2 }` and `{ b: 2, a: 1 }` might be treated as different keys depending on JS engine key ordering, though usually consistent for simple objects.
- Not suitable for functions taking arguments that cannot be JSON stringified (like Functions or circular objects).

</details>

<details>
<summary><strong><code>debounce&lt;T extends (...args: any[]) =&gt; any&gt;(fn: T, ms?: number, options?: { leading?: boolean; trailing?: boolean; }): (...args: Parameters&lt;T&gt;) =&gt; void</code></strong></summary>

Creates a debounced version of a function.

```ts
import { debounce } from "atron-js";

// Trailing (default): fires once after silence
const onResize = debounce(() => console.log("resized"), 200);
window.addEventListener("resize", onResize);

// Leading: fire immediately, no trailing by default
const onInputImmediate = debounce((val) => console.log("immediate:", val), 300, { leading: true });
onInputImmediate("a"); // logs immediately

// Leading + trailing: first immediately, last after wait
const onScroll = debounce(() => console.log("scroll"), 100, { leading: true, trailing: true });
```

</details>

<details>
<summary><strong><code>throttle&lt;T extends (...args: any[]) =&gt; any&gt;(fn: T, ms?: number, options?: { leading?: boolean; trailing?: boolean; }): (...args: Parameters&lt;T&gt;) =&gt; void</code></strong></summary>

Ensures a function runs at most once every `ms` milliseconds.

```ts
import { throttle } from "atron-js";

// Default: leading and trailing
const onScroll = throttle(() => console.log("scroll"), 100);
window.addEventListener("scroll", onScroll);

// Only trailing calls
const onDrag = throttle(() => console.log("drag"), 50, { leading: false, trailing: true });
```

</details>

### Fetch helpers

<details>
<summary><strong><code>getJSON&lt;T&gt;(url: string, options?: GetJSONOptions): Promise&lt;T&gt;</code></strong></summary>

Fetch JSON from a URL with status checking, content-type validation, and
optional timeout.

```ts
import { getJSON } from "atron-js";

const user = await getJSON<User>("https://api.example.com/user/1", {
  timeoutMs: 5000,
});
```

</details>

<details>
<summary><strong><code>postJSON&lt;TBody, TResponse&gt;(url: string, body: TBody, options?: PostJSONOptions): Promise&lt;TResponse&gt;</code></strong></summary>

Send a JSON `POST` request and parse the JSON response.

```ts
import { postJSON } from "atron-js";

const created = await postJSON("https://api.example.com/users", {
  name: "Atron",
});
```

</details>

<details>
<summary><strong><code>retry&lt;T&gt;(fn: () =&gt; Promise&lt;T&gt;, attempts: number, delayMs?: number): Promise&lt;T&gt;</code></strong></summary>

Retry an async function a fixed number of times before failing.

```ts
import { retry, getJSON } from "atron-js";

const data = await retry(() => getJSON("https://api.example.com/flaky"), 3, 250);
```

</details>

<details>
<summary><strong><code>timeout&lt;T&gt;(promise: Promise&lt;T&gt;, ms: number, message?: string): Promise&lt;T&gt;</code></strong></summary>

Wrap a promise and reject with a timeout error if it takes too long.

```ts
import { timeout, getJSON } from "atron-js";

const data = await timeout(getJSON("/slow-endpoint"), 2000);
```

</details>

<details>
<summary><strong><code>sleep(ms: number): Promise&lt;void&gt;</code></strong></summary>

Sleep for a given number of milliseconds.

```ts
import { sleep } from "atron-js";

await sleep(500);
```

</details>

<details>
<summary><strong><code>sequence&lt;T&gt;(tasks: Array&lt;() =&gt; Promise&lt;T&gt;&gt;): Promise&lt;T[]&gt;</code></strong></summary>

Run async tasks one-by-one and collect their results.

```ts
import { sequence, getJSON } from "atron-js";

const urls = ["/step1", "/step2", "/step3"];
const tasks = urls.map((url) => () => getJSON(url));
const results = await sequence(tasks);
```

</details>

<details>
<summary><strong><code>parallel&lt;T&gt;(tasks: Array&lt;() =&gt; Promise&lt;T&gt;&gt;, limit?: number): Promise&lt;T[]&gt;</code></strong></summary>

Run async tasks in parallel with an optional concurrency limit.

```ts
import { parallel, getJSON } from "atron-js";

const urls = ["/a", "/b", "/c", "/d"];
const tasks = urls.map((url) => () => getJSON(url));
const results = await parallel(tasks, 2); // at most 2 at a time
```

</details>

<details>
<summary><strong><code>batch&lt;T&gt;(items: T[], size: number): T[][]</code></strong></summary>

Split an array into evenly sized batches.

```ts
import { batch } from "atron-js";

const groups = batch([1, 2, 3, 4, 5], 2); // [[1,2],[3,4],[5]]
```

</details>

### Logging helpers

<details>
<summary><strong><code>success(message: string): void</code></strong></summary>

Log a checkmark with the message. Useful for positive status updates.

```ts
import { success } from "atron-js";

success("Deployment finished");
// ✔ Deployment finished
```

</details>

<details>
<summary><strong><code>error(message: string): void</code></strong></summary>

Log an error message with a leading "✖". Does **not** throw; only logs.

```ts
import { error } from "atron-js";

error("Failed to connect to database");
// ✖ Failed to connect to database
```

</details>

<details>
<summary><strong><code>warning(message: string): void</code></strong></summary>

Log a warning with a "⚠ Warning:" prefix.

```ts
import { warning } from "atron-js";

warning("Using default configuration");
// ⚠ Warning: Using default configuration
```

</details>

<details>
<summary><strong><code>info(message: string): void</code></strong></summary>

Log an informational message with a "ℹ Info:" prefix.

```ts
import { info } from "atron-js";

info("Server listening on port 3000");
// ℹ Info: Server listening on port 3000
```

</details>

<details>
<summary><strong><code>debug(message: string): void</code></strong></summary>

Log a debug message with a "🐞 Debug:" prefix. Only logs when
`NODE_ENV` is **not** `"production"`.

```ts
import { debug } from "atron-js";

debug("Got payload: " + JSON.stringify(payload));
// 🐞 Debug: Got payload ... (only when NODE_ENV !== "production")
```

</details>

<details>
<summary><strong><code>title(message: string): void</code></strong></summary>

Print a title to separate sections.

```ts
import { title } from "atron-js";

title("Build Summary");
```

</details>

<details>
<summary><strong><code>box(message: string): void</code></strong></summary>

Wrap a message (optionally multi-line) in an ASCII box.

```ts
import { box } from "atron-js";

box("Deployment complete\nAll services healthy");
```

</details>

<details>
<summary><strong><code>banner(text: string): void</code></strong></summary>

Print a simple uppercase banner framed by `=` characters.

```ts
import { banner } from "atron-js";

banner("ATRON JS");
```

</details>

<details>
<summary><strong><code>timestamp(message: string): void</code></strong></summary>

Log a message prefixed with a `[HH:MM:SS]` timestamp.

```ts
import { timestamp } from "atron-js";

timestamp("Job finished");
// [12:34:56] Job finished
```

</details>

<details>
<summary><strong><code>logJSON(obj: unknown): void</code></strong></summary>

Pretty-print JSON in a readable multi-line format.

```ts
import { logJSON } from "atron-js";

logJSON({ id: 1, name: "Atron", active: true });
```

</details>

### Strings

<details>
<summary><strong><code>capitalize(text: string): string</code></strong></summary>

Capitalizes the **first character** of the string. If the string is empty, returns `""`.

```ts
capitalize("hello"); // "Hello"
capitalize("hELLO"); // "HELLO"
capitalize(""); // ""
capitalize("  space"); // "  space" (leading space is unchanged)
```

**How it works:**

- If `text` is falsy (empty string), it returns `""`.
- Otherwise, it uppercases `text.charAt(0)` and appends the rest of the string.

</details>
<details>
<summary><strong><code>reverse(text: string): string</code></strong></summary>

Returns a new string with characters in reverse order.

```ts
reverse("abc"); // "cba"
reverse("racecar"); // "racecar"
reverse("hello world"); // "dlrow olleh"
```

**How it works:**

- Splits the string into an array of characters, reverses the array, and joins it back.

</details>
<details>
<summary><strong><code>camelCase(text: string): string</code></strong></summary>

Converts a string into camelCase.

```ts
camelCase("hello world"); // "helloWorld"
camelCase("hello-world_test"); // "helloWorldTest"
camelCase("--Hello WORLD--"); // "helloWorld"
camelCase("version-2-update"); // "version2Update"
```

</details>
<details>
<summary><strong><code>kebabCase(text: string): string</code></strong></summary>

Converts a string into kebab-case.

```ts
kebabCase("hello world"); // "hello-world"
kebabCase("helloWorld"); // "hello-world"
kebabCase("XMLHttpRequest"); // "xml-http-request"
kebabCase("ver1Test2"); // "ver1-test2"
kebabCase("--héllo Wørld--"); // "héllo-wørld"
```

</details>
<details>
<summary><strong><code>isEmpty(text: string): boolean</code></strong></summary>

Checks if a string is **empty** or contains **only whitespace**.

```ts
isEmpty(""); // true
isEmpty("   "); // true
isEmpty("\n\t"); // true
isEmpty("hello"); // false
isEmpty("  hello  "); // false
```

**How it works:**

- If `text` is falsy or `text.trim().length === 0`, it returns `true`.

</details>
<details>
<summary><strong><code>toSlug(text: string, options?: ToSlugOptions): string</code></strong></summary>

Convert arbitrary text into a URL/path-friendly slug.

```ts
import { toSlug } from "atron-js";

toSlug("Hello World"); // "hello-world"
toSlug("École", { removeDiacritics: true }); // "ecole"
toSlug("Привет мир", { allowUnicode: true }); // "привет-мир"
toSlug("$%#", { fallback: "n-a" }); // "n-a"
toSlug("Hello World", { separator: "_" }); // "hello_world"
toSlug("Hello World", { lowercase: false }); // "Hello-World"
toSlug("abcdef ghi", { maxLength: 5 }); // "abcde"
```

`ToSlugOptions`:

- `separator?: string` – character used between words (default `"-"`).
- `lowercase?: boolean` – lowercases the slug when `true` (default `true`).
- `removeDiacritics?: boolean` – strip accents/diacritics when `true` (default `true`).
- `maxLength?: number` – optional max length; trailing separators are trimmed after truncation.
- `allowUnicode?: boolean` – when `true`, keep non-Latin letters instead of removing them (default `false`).
- `fallback?: string` – value to return if the slug would otherwise be empty (default `""`).

</details>

### Numbers

<details>
<summary><strong><code>randomNumber(min: number, max: number): number</code></strong></summary>

Returns a **random integer** between `min` and `max` (inclusive).

```ts
randomNumber(1, 6); // 1–6, like a dice roll
randomNumber(0, 0); // always 0
randomNumber(-5, 5); // -5..5
```

**How it works:**

- Uses `Math.random()` and `Math.floor()` to map the random value into the `[min, max]` range.

> Note: This is a simple helper, not cryptographically secure.

</details>
<details>
<summary><strong><code>isEven(num: number): boolean</code></strong></summary>

Returns `true` if the number is even, `false` otherwise.

```ts
isEven(2); // true
isEven(3); // false
isEven(0); // true
isEven(-4); // true
```

**How it works:**

- Uses the remainder operator: `num % 2 === 0`.

</details>
<details>
<summary><strong><code>clamp(num: number, min: number, max: number): number</code></strong></summary>

Restricts a number to stay within the `[min, max]` range.

```ts
clamp(5, 0, 10); // 5 (already in range)
clamp(-5, 0, 10); // 0 (clamped up)
clamp(15, 0, 10); // 10 (clamped down)
```

**How it works:**

- First takes `Math.max(num, min)`, then `Math.min(result, max)`.

</details>

### Time

<details>
<summary><strong><code>delay(ms: number): Promise&lt;void&gt;</code></strong></summary>

"Sleep" for the given number of milliseconds. This is useful in async code, demos, or simple retry loops.

```ts
console.log("Start");
await delay(1000);
console.log("One second later");
```

**How it works:**

- Wraps `setTimeout` in a `Promise` that resolves after `ms` milliseconds.

</details>
<details>
<summary><strong><code>formatTime(date: Date): string</code></strong></summary>

Formats a `Date` into a simple 24-hour `"HH:MM"` string using your **local time zone**.

```ts
const date = new Date(2020, 0, 1, 14, 5); // 14:05 local time
formatTime(date); // "14:05"
```

**How it works:**

- Uses `date.toTimeString()` and slices the first 5 characters (`HH:MM`).

</details>

## Project structure

<details>
<summary>Project structure</summary>

```text
src/
  index.ts           # Re-exports all public utilities
  utils/
    strings.ts       # String helpers (capitalize, camelCase, kebabCase, toSlug, ...)
    numbers.ts       # Number helpers (randomNumber, isEven, clamp)
    arrays.ts        # Array helpers (unique, chunk, shuffle, flatten, batch)
    time.ts          # Time helpers (delay, formatTime)
    object.ts        # Object helpers (deepClone, deepEqual)
    memoize.ts       # Function memoization helper
    debounce.ts
    throttle.ts
  handlers/
    tryCatch.ts      # Error-handling helper returning [data, error]
  fetch/
    index.ts         # getJSON, postJSON, retry, timeout, sequence, parallel, sleep, batch
  log/
    *.ts             # Console logging helpers (success, error, warning, info, debug, ...)
  types/
    fetch.ts         # Types for fetch helpers
    handlers.ts      # Types for handlers

tests/               # Node built-in tests (node:test + tsx) for all utilities
dist/                # Compiled output (built by tsup)
```

</details>

---

## Testing

This project uses **Node's built-in test runner** (`node:test`) with `tsx` for TypeScript.

<details>
<summary>Run tests</summary>

```bash
npm test
```

</details>

Requirements:

- **Node.js 18+** (Node 20+ recommended) for the Node test runner.

---

## Contributing

Contributions are welcome! Please read the [contribution guide](./CONTRIBUTING.md)
for details on setup, testing, and proposing changes.

If you want to discuss ideas or coordinate work in real time, you can
join the Discord server: https://discord.gg/xqgmDXgked

---

## License

MIT – see the license in `package.json`.
