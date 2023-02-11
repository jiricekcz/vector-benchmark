import { BenchmarkReport } from "../benchmarkReport";
import { blue, red, yellow, white, green, magenta, gray } from "ansi-colors"
import { LibraryName } from "../types";

const mainTitle = (title: string) => red(title);
const subTitle = (title: string) => blue(title);
const num = (num: string | number) => yellow(num.toString());
const name = (name: string) => green(name);
const unit = (unit: string) => white(unit);
const benchmarkName = (name: string) => magenta(name);
const runName = (name: string) => gray(name);
const libName = (name: string) => name;
export function getConsoleString(report: BenchmarkReport): string {
    let str = `\n\n\n\n     ${mainTitle("Vector Operations Benchmark Report")}\n`;
    str += "============================================\n";
    str += "\n\n";
    str += subTitle("Hardware Info\n");
    str += "=============\n";
    str += `CPU: ${name(report.hardwareInfo.cpu.manufacturer ?? "UNKNOWN")} ${name(report.hardwareInfo.cpu.brand ?? "UNKNOWN")} @ ${num(report.hardwareInfo.cpu.fequency.default === null ? `UNKNOWN` : `${report.hardwareInfo.cpu.fequency.default / 1e9}`)} ${unit("GHz")}\n`;
    str += `    Cores: ${num(report.hardwareInfo.cpu.cores.count ?? "UNKNOWN")} (${num(report.hardwareInfo.cpu.cores.physical ?? "UNKNOWN")} physical, ${num(report.hardwareInfo.cpu.cores.efficiency ?? "UNKNOWN")} efficiency, ${num(report.hardwareInfo.cpu.cores.performance ?? "UNKNOWN")} performance)\n`;
    str += `    Cache: L1d: ${num(report.hardwareInfo.cpu.cache.l1d ?? "UNKNOWN")} ${unit("B")}, L1i: ${num(report.hardwareInfo.cpu.cache.l1i ?? "UNKNOWN")} ${unit("B")}, L2: ${num(report.hardwareInfo.cpu.cache.l2 === null ? `UNKNOWN` : report.hardwareInfo.cpu.cache.l2 / 1024)} ${unit("KB")}, L3: ${num(report.hardwareInfo.cpu.cache.l3 === null ? `UNKNOWN` : report.hardwareInfo.cpu.cache.l3 / 1024)} ${unit("KB")}\n`;
    str += `Memory: ${num(report.hardwareInfo.memory.total === null ? "UNKNOWN" : Math.round(report.hardwareInfo.memory.total / 1024 ** 2))} ${unit("MB")} @ ${num(report.hardwareInfo.memory.clockSpeed === null ? "UNKNOWN" : report.hardwareInfo.memory.clockSpeed / 1e6)} ${unit("MHz")}\n`;
    str += `OS: ${name(report.hardwareInfo.os.platform ?? "UNKNOWN")}\n`;

    str += "\n\n";
    str += subTitle("Benchmark Results\n");
    str += "=================\n\n";
    for (const name in report.results) {
        const result = report.results[name];
        str += `${benchmarkName(name)}\n`;
        str += "-".repeat(name.length) + "\n";
        for (const rn in result.runs) {
            // const run = result.runs[rn];
            str += `  ${runName(rn)}\n`;
            for (const lib in result.runs[rn]) {
                const time = result.runs[rn][lib as LibraryName];
                str += `    ${libName(lib)}: ${num(time === null ? "N/A" : time)} ${unit("ms")}\n`;
            }
        }
    }
    return str;
}