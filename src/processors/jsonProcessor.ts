import { writeFile } from "fs/promises";
import { BenchmarkReport } from "../benchmarkReport";

export function getJSONString(report: BenchmarkReport): string {
    return JSON.stringify(report, null, 4);
}

export function writeJSONToFile(report: BenchmarkReport, filePath: string): Promise<void> {
    return writeFile(filePath, getJSONString(report));
}