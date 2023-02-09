import { BenchmarkSeries } from "../types";
import { ADDITION_IN_PLACE } from "./additions";


export const benchmarks: BenchmarkSeries = [
    {
        benchmarks: ADDITION_IN_PLACE,
        runs: [
            {
                rounds: 1000000,
                vectorLength: 2
            },
            {
                rounds: 1000000,
                vectorLength: 3
            }
        ]
    }
]