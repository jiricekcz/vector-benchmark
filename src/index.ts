import {run as runBenchmark} from './benchmarker';

const report = runBenchmark();

report.on("finished", r => {
    console.log(r.toJSON());
})