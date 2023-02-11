import { BenchmarkReport } from "../benchmarkReport";
import { LibraryName } from "../types";
import { writeFile } from "fs/promises";

export function getMarkdownString(report: BenchmarkReport): string {
    let str = `# Vector Operations Benchmark Report\n\n`;
    str += "## Hardware Info\n\n";
    str += `### CPU (${report.hardwareInfo.cpu.manufacturer ?? "UNKNOWN"} ${report.hardwareInfo.cpu.brand ?? "UNKNOWN"} @ ${report.hardwareInfo.cpu.fequency.default === null ? `UNKNOWN` : `${report.hardwareInfo.cpu.fequency.default / 1e9}`} GHz)\n\n`;
    str += `Cores: ${report.hardwareInfo.cpu.cores.count ?? "UNKNOWN"} (${report.hardwareInfo.cpu.cores.physical ?? "UNKNOWN"} physical, ${report.hardwareInfo.cpu.cores.efficiency ?? "UNKNOWN"} efficiency, ${report.hardwareInfo.cpu.cores.performance ?? "UNKNOWN"} performance)\n\n`;
    str += `#### Cache\n\nLayer 1 data: ${report.hardwareInfo.cpu.cache.l1d ?? "UNKNOWN"} B  \nLayer 1 instruction: ${report.hardwareInfo.cpu.cache.l1i ?? "UNKNOWN"} B  \nLayer 2: ${report.hardwareInfo.cpu.cache.l2 === null ? `UNKNOWN` : report.hardwareInfo.cpu.cache.l2 / 1024} KB  \nL3: ${report.hardwareInfo.cpu.cache.l3 === null ? `UNKNOWN` : report.hardwareInfo.cpu.cache.l3 / 1024} KB\n\n`;
    str += `### Memory \n\n`;
    str += `${report.hardwareInfo.memory.total === null ? "UNKNOWN" : Math.round(report.hardwareInfo.memory.total / 1024 ** 2)} MB @ ${report.hardwareInfo.memory.clockSpeed === null ? "UNKNOWN" : report.hardwareInfo.memory.clockSpeed / 1e6} MHz\n\n`;
    str += `### OS\n\n`;
    str += `${report.hardwareInfo.os.platform ?? "UNKNOWN"}\n\n`;
    str += "## Benchmark Results\n\n";
    for (const name in report.results) {
        const result = report.results[name];
        str += `### ${name}\n`;
        for (const rn in result.runs) {
            str += `\n#### ${rn}\n\n`;
            for (const lib in result.runs[rn]) {
                const time = result.runs[rn][lib as LibraryName];
                str += `- ${lib}: ${time === null ? "N/A" : time} ms\n`;
            }
        }
    }
    return str;
}

export function writeMarkdownToFile(report: BenchmarkReport, filePath: string): Promise<void> {
    return writeFile(filePath, getMarkdownString(report));
}