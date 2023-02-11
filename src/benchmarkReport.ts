import EventEmitter from "events";
import hwInfo from "systeminformation";
import { Benchmark, BenchmarkHardwareInfo, LibraryName, LIBRARY_NAMES } from "./types";

export class BenchmarkReport extends EventEmitter {
    public totalRunLength: number;
    public currentRunLength: number = 0;
    public results: {
        [name: string]: BenchmarkResult;
    } = {};
    public hardwareInfo: BenchmarkHardwareInfo = {
        isVirtual: null,
        cpu: {
            brand: null,
            manufacturer: null,
            fequency: {
                default: null,
                max: null,
                min: null,
            },
            cores: {
                count: null,
                physical: null,
                efficiency: null,
                performance: null,
            },
            count: null,
            cache: {
                l1d: null,
                l1i: null,
                l2: null,
                l3: null,
            }
        },
        memory: {
            total: null,
            clockSpeed: null,
        },
        os: {
            platform: null,
        }
    }

    private hardwareInfoPromise: Promise<void> = this.gatherHardwareInfo();
    constructor({ totalRunLength }: { totalRunLength: number }) {
        super();
        this.totalRunLength = totalRunLength;
    }

    public finished(): Promise<void> {
        return Promise.all([new Promise<void>((resolve) => {
            this.once("finished", () => resolve());
        }), this.hardwareInfoPromise]).then(() => { });
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

    public async finishOk(): Promise<void> {
        await this.hardwareInfoPromise;
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
        hardwareInfo: BenchmarkHardwareInfo,

    } {
        return {
            totalRunLength: this.totalRunLength,
            currentRunLength: this.currentRunLength,
            progress: this.progress(),
            results: Object.fromEntries(Object.entries(this.results).map(([name, result]) => [name, result.toJSON()])),
            hardwareInfo: this.hardwareInfo,
        }
    }


    protected async gatherHardwareInfo(): Promise<void> {
        const virtual = (await hwInfo.system()).virtual;
        this.hardwareInfo.isVirtual = virtual;
        const cpu = await hwInfo.cpu();
        this.hardwareInfo.cpu.brand = cpu.brand;
        this.hardwareInfo.cpu.manufacturer = cpu.manufacturer;
        this.hardwareInfo.cpu.fequency.default = cpu.speed * 1e9;
        this.hardwareInfo.cpu.fequency.max = cpu.speedMax * 1e9;
        this.hardwareInfo.cpu.fequency.min = cpu.speedMin * 1e9;
        this.hardwareInfo.cpu.cores.count = cpu.cores;
        this.hardwareInfo.cpu.cores.physical = cpu.physicalCores;
        this.hardwareInfo.cpu.cores.efficiency = cpu.efficiencyCores ?? null;
        this.hardwareInfo.cpu.cores.performance = cpu.performanceCores ?? null;
        this.hardwareInfo.cpu.count = cpu.processors;
        this.hardwareInfo.cpu.cache.l1d = cpu.cache.l1d;
        this.hardwareInfo.cpu.cache.l1i = cpu.cache.l1i;
        this.hardwareInfo.cpu.cache.l2 = cpu.cache.l2;
        this.hardwareInfo.cpu.cache.l3 = cpu.cache.l3;
        const memory = await hwInfo.mem();
        this.hardwareInfo.memory.total = memory.total;
        const memoryList = await hwInfo.memLayout();
        this.hardwareInfo.memory.clockSpeed = Math.min(...memoryList.map(m => m.clockSpeed).filter(m => m !== null) as number[]) * 1e6;
        const os = await hwInfo.osInfo();
        this.hardwareInfo.os.platform = os.platform;
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