import { run as runBenchmark } from './benchmarker';
import { SingleBar } from "cli-progress"
import { writeJSONToFile } from './processors/jsonProcessor';
import { getConsoleString } from './processors/consoleProcesser';
import { writeMarkdownToFile } from './processors/markdownProcessor';
const bar = new SingleBar({
    format: "Progress: {bar} {percentage}% | {eta}s",
})
const report = runBenchmark();
bar.start(report.totalRunLength, 0);
report.on("progress", r => {
    bar.update(r.currentRunLength);
});


report.on("finished", async r => {
    bar.stop();
    writeJSONToFile(r, "report.json");
    writeMarkdownToFile(r, "report.md")
    console.log(getConsoleString(r))
})