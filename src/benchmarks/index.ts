import { BenchmarkSeries } from "../types";
import { ADDITION_IN_PLACE } from "./additions";


export const benchmarks: BenchmarkSeries = [
    {
        benchmark: ADDITION_IN_PLACE,
        runs: [
            {
                rounds: 1,
                vectorLength: 1
            },
            {
                rounds: 1000000,
                vectorLength: 2
            },
            {
                rounds: 1000000,
                vectorLength: 3
            },
            {
                rounds: 100000,
                vectorLength: 5
            },
            {
                rounds: 1000,
                vectorLength: 1000
            },
            {
                rounds: 10,
                vectorLength: 200000
            },
            
        ]
    }
]