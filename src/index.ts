import { run as runBenchmark } from './benchmarker';
import { SingleBar } from "cli-progress"
import { writeJSONToFile } from './processors/jsonProcessor';
import { getConsoleString } from './processors/consoleProcesser';
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
    console.log(getConsoleString(r))
})