import EventEmitter from "events";
import { Benchmark, LibraryName, LIBRARY_NAMES } from "./types";

export class BenchmarkReport extends EventEmitter {
    public totalRunLength: number;
    public currentRunLength: number = 0;
    public results: {
        [name: string]: BenchmarkResult;
    } = {};

    constructor({ totalRunLength }: { totalRunLength: number }) {
        super();
        this.totalRunLength = totalRunLength;
    }

    public finished(): Promise<void> {
        return new Promise((resolve) => {
            this.once("finished", () => resolve());
        });
    }

    public progress(): number {
        return this.currentRunLength / this.totalRunLength;
    }


    public on(eventName: "progress", callback: (event: { totalRunLength: number, currentRunLength: number, progress: number }) => void): this;
    public on(eventName: "finished", callback: (event: this) => void): this;
    public on(eventName: "benchmark", callback: (benchmark: Benchmark<any>) => void): this;
    public on(eventName: string, callback: (...args: any[]) => void): this {
        return super.on(eventName, callback);
    }


    public emit(eventName: "progress", event: { totalRunLength: number, currentRunLength: number, progress: number }): boolean;
    public emit(eventName: "finished", event: this): boolean;
    public emit(eventName: "benchmark", benchmark: Benchmark<any>): boolean;
    public emit(eventName: string, ...args: any[]): boolean {
        return super.emit(eventName, ...args);
    }

    public finishOk(): void {
        this.emit("finished", this);
    }

    public finishBenchmarkRun(runLength: number): void {
        this.currentRunLength += runLength;
        this.emit("progress", {
            totalRunLength: this.totalRunLength,
            currentRunLength: this.currentRunLength,
            progress: this.progress(),
        });
    }

    public initBenchmark<A extends Record<string, any> = Record<string, any>>(benchmark: Benchmark<A>): void {
        this.emit("benchmark", benchmark);
    }

    public addResult(result: { name: string, fullName: string, runTime: number, library: LibraryName }): void {
        if (!this.results[result.name]) {
            this.results[result.name] = new BenchmarkResult({ name: result.name });
        }
        this.results[result.name].addRun({
            runName: result.fullName,
            lib: result.library,
            runTime: result.runTime,
        });
    }

    public toJSON(): {
        totalRunLength: number,
        currentRunLength: number,
        progress: number,
        results: { [name: string]: ReturnType<BenchmarkResult["toJSON"]> },
    } {
        return {
            totalRunLength: this.totalRunLength,
            currentRunLength: this.currentRunLength,
            progress: this.progress(),
            results: Object.fromEntries(Object.entries(this.results).map(([name, result]) => [name, result.toJSON()]))
        }
    }
}

export class BenchmarkResult {
    public name: string;
    public runs: { [runName: string]: { [lib in LibraryName]: number | null } } = {};
    constructor({ name }: { name: string }) {
        this.name = name;
    }
    addRun({ runName, lib, runTime }: { runName: string, lib: LibraryName, runTime: number }): void {
        if (!this.runs[runName]) {
            const run: any = {};
            for (const lib of LIBRARY_NAMES) {
                run[lib] = null;
            }
            this.runs[runName] = run;
        }
        this.runs[runName][lib] = runTime;
    }

    toJSON(): {
        name: string,
        runs: { [runName: string]: { [lib in LibraryName]: number | null } },
    } {
        return {
            name: this.name,
            runs: this.runs,
        };
    }
}