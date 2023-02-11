import { Benchmark, BenchmarkOptions } from '../types';
import VectOps from 'vect-ops';
import { performance } from 'perf_hooks';
export const ADDITION_IN_PLACE: Benchmark<BenchmarkOptions['addition-in-place']> = {
    name: 'addition-in-place',
    fullName: ({ vectorLength, rounds }) => {
        return `Addition of ${vectorLength}-dimensional vectors in place ${rounds} times`
    },
    runLength: ({ rounds, vectorLength }) => rounds * vectorLength,
    benchmarks: {
        'vect-ops': ({ vectorLength, rounds }) => {
            const vect1 = new Array(vectorLength).fill(0);
            const vect2 = new Array(vectorLength).fill(1);

            const start = performance.now();
            for (let i = 0; i < rounds; i++) {
                VectOps.add(vect1, vect2);
            }
            const end = performance.now();
            return end - start;
        }
    }
};
