import { BenchmarkReport } from './benchmarkReport';
import { benchmarks } from './benchmarks';
import { LIBRARY_NAMES } from './types';



export function totalRunLength(): number {
    let total = 0;
    for (const benchmark of benchmarks) {
        for (const run of benchmark.runs) {
            total += benchmark.benchmark.runLength(run);
        }
    }
    return total;
}

export function totalBenchmarkCount(): number {
    return benchmarks.length;
}

export function run(): BenchmarkReport {
    const report = new BenchmarkReport({ totalRunLength: totalRunLength() });
    runWithReport(report);
    return report;
}
async function runWithReport(result: BenchmarkReport): Promise<void> {
    for (const benchmark of benchmarks) {
        result.initBenchmark(benchmark.benchmark);
        for (const run of benchmark.runs) {
            const runLength = benchmark.benchmark.runLength(run);
            for (const libraryName of LIBRARY_NAMES) {
                const benchmarkFn = benchmark.benchmark.benchmarks[libraryName];
                const time = await benchmarkFn(run);
                if (time !== null) {
                    result.addResult({
                        fullName: benchmark.benchmark.fullName(run),
                        name: benchmark.benchmark.name,
                        library: libraryName,
                        runTime: time,
                    });
                }
            }
            result.finishBenchmarkRun(runLength);

        }
    }
    result.finishOk();
}

