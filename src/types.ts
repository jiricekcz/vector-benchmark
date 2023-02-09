export const LIBRARY_NAMES = ["vect-ops"] as const;

export type LibraryName = typeof LIBRARY_NAMES[number];

export type Benchmark<A extends Record<string, any>> = {
    name: string,
    fullName: (options: A) => string,
    benchmarks: {
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

