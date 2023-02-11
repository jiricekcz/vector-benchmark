export const LIBRARY_NAMES = ["vect-ops"] as const;

export type LibraryName = typeof LIBRARY_NAMES[number];

export type Benchmark<A extends Record<string, any>> = {
    /** Name of the benchmark */
    name: string,
    /** Full name of the benchmark, dependant on the options */
    fullName: (options: A) => string,
    /** An approximate number of operations to be performed */
    runLength: (options: A) => number,
    /** 
     * The actual benchmarks  
     * The key is the name of the library  
     * If a benchmark returns null, it is assumed that the library does not support the benchmark
     * 
     */
    benchmarks: {
        /**
         * @param options The options for the benchmark
         * @returns A number representing the milliseconds it took to run the benchmark, or null if the library does not support the benchmark
         */
        [K in LibraryName]: (options: A) => number | Promise<number> | null;
    }
}

export type BenchmarkSet<A extends Record<string, any>> = {
    benchmarks: Benchmark<A>;
    runs: A[];
};

export type BenchmarkSeries = BenchmarkSet<BenchmarkOptionsValue>[]

export type BenchmarkOptionsKey = keyof BenchmarkOptions;
export type BenchmarkOptionsValue = BenchmarkOptions[keyof BenchmarkOptions];


// Specfic benchmarks
export type BenchmarkOptions = {
    'addition-in-place': {
        vectorLength: number;
        rounds: number;
    }
} 

