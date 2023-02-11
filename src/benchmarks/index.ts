import { BenchmarkSeries } from "../types";
import { ADDITION_IN_PLACE } from "./additions";


export const benchmarks: BenchmarkSeries = [
    {
        benchmark: ADDITION_IN_PLACE,
        runs: [
            {
                rounds: 100000,
                vectorLength: 2
            },
            {
                rounds: 100000,
                vectorLength: 3
            }
        ]
    }
]