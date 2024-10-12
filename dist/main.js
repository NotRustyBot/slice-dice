#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const minimist_1 = __importDefault(require("minimist"));
const host_1 = require("./host");
//get node parameters
const args = (0, minimist_1.default)(process.argv.slice(2));
const configName = args.c ?? args.config;
const pipelineName = args.p ?? args.pipeline;
const keep = args.k ?? args.keep ?? false;
const input = args.i ?? args.input ?? ".";
const host = args.h ?? args.host ?? false;
const help = args["?"] ?? args.help ?? false;
if (help) {
    console.log("Usage: slice-dice [options]");
    console.log("Options:");
    console.log("  -c, --config <file>  Path to the config file");
    console.log("  -p, --pipeline <name>  Name of the pipeline to use");
    console.log("  -k, --keep  Keep temporary files");
    console.log("  -i, --input <path>  Path to the input directory");
    console.log("  -h, --host  Start the web server");
    process.exit(0);
}
if (host) {
    (0, host_1.startHosting)(typeof host === "string" ? parseInt(host) : host);
}
else {
    if (configName === undefined) {
        console.error("No config file provided");
        process.exit(1);
    }
    const config = JSON.parse(fs_1.default.readFileSync(configName, "utf8"));
    async function start() {
        let pipeline = config.pipelines.find((p) => p.name == pipelineName);
        if (pipelineName == undefined) {
            if (config.pipelines.length > 0) {
                console.log(chalk_1.default.gray(`Default pipeline "${config.pipelines[0].name}"`));
                pipeline = config.pipelines[0];
            }
            else {
                console.error("No pipeline found");
                process.exit(1);
            }
        }
        if (pipeline == undefined) {
            console.error("Pipeline not found. Known pipelines:\n", config.pipelines.map((p) => p.name).join("\n "));
            process.exit(1);
        }
        let job = `job-${pipeline.name}-${directoryTimestamp()}`;
        if (fs_1.default.existsSync(path_1.default.join(input))) {
            fs_1.default.mkdirSync(job, { recursive: true });
            if (fs_1.default.lstatSync(path_1.default.join(input)).isDirectory()) {
                //copy input to job directory
                for (const file of fs_1.default.readdirSync(input)) {
                    if (file.endsWith(".png")) {
                        fs_1.default.copyFileSync(path_1.default.join(input, file), path_1.default.join(job, file));
                    }
                }
            }
            else {
                fs_1.default.copyFileSync(path_1.default.join(input), path_1.default.join(job, path_1.default.basename(input)));
            }
        }
        else {
            console.error("Input not found");
            return;
        }
        console.log(chalk_1.default.bgBlue(chalk_1.default.yellowBright(` Running pipeline "${pipeline.name}" `)));
        for (const dir of config.definitions.directory ?? []) {
            fs_1.default.mkdirSync(path_1.default.join(job, dir.data), { recursive: true });
        }
        let stepIndex = 0;
        for await (const step of pipeline.steps) {
            stepIndex++;
            const tool = require(`./tools/${step.tool}`).default;
            const toolInstance = new tool();
            console.log(chalk_1.default.yellow(`=== [${stepIndex}] ${step.tool} ===`));
            toolInstance.jobDirectory = job;
            toolInstance.setRunData(path_1.default.parse(input).name, directoryTimestamp());
            toolInstance.setDefinitions(config.definitions);
            toolInstance.setParameters(step.parameters);
            try {
                let result = await toolInstance.run();
                if (!result) {
                    break;
                }
            }
            catch (error) {
                console.error(error);
                break;
            }
        }
        if (!keep)
            fs_1.default.rmSync(job, { recursive: true, force: true });
    }
    start();
}
function directoryTimestamp() {
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = date.getFullYear();
    const hh = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");
    const ss = date.getSeconds().toString().padStart(2, "0");
    return `${dd}-${mm}-${yyyy}-${hh}-${min}-${ss}`;
}
