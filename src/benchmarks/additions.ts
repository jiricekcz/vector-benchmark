import { Benchmark, BenchmarkOptions } from '../types';
export const ADDITION_IN_PLACE: Benchmark<BenchmarkOptions['addition-in-place']> = {
    name: 'addition-in-place',
    fullName: ({ vectorLength, rounds }) => {
        return `Addition of ${vectorLength}-dimensional vectors in place ${rounds} times`
    },
    benchmarks: {
        'vect-ops': ({ vectorLength, rounds }) => {
            return null;
        }
    }
};
