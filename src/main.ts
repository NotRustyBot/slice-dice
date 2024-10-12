#!/usr/bin/env node
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { Tool } from "./tool";
import minimist from "minimist";
import { startHosting } from "./host";

type Pipeline = {
    name: string;
    steps: Array<{
        tool: string;
        parameters: any;
    }>;
};

export type Config = {
    definitions: Record<string, any[]>;
    pipelines: Array<Pipeline>;
};

//get node parameters
const args = minimist(process.argv.slice(2));
const configName = args.c ?? args.config;
const pipelineName = args.p ?? args.pipeline;
const keep = args.k ?? args.keep ?? false;
const input = args.i ?? args.input ?? ".";
const host = args.h ?? args.host ?? false;
const help = args["?"] ?? args.help ?? false;

if(help) {
    console.log("Usage: slice-dice-ui [options]");
    console.log("Options:");
    console.log("  -c, --config <file>  Path to the config file");
    console.log("  -p, --pipeline <name>  Name of the pipeline to use");
    console.log("  -k, --keep  Keep temporary files");
    console.log("  -i, --input <path>  Path to the input directory");
    console.log("  -h, --host  Start the web server");    
    process.exit(0);
}

if (host) {
    startHosting();
} else {
    if (configName === undefined) {
        console.error("No config file provided");
        process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configName, "utf8")) as Config;

    async function start() {
        let pipeline = config.pipelines.find((p) => p.name == pipelineName);
        if (pipelineName == undefined) {
            if (config.pipelines.length > 0) {
                console.log(chalk.gray(`Default pipeline "${config.pipelines[0].name}"`));
                pipeline = config.pipelines[0];
            } else {
                console.error("No pipeline found");
                process.exit(1);
            }
        }

        if (pipeline == undefined) {
            console.error("Pipeline not found. Known pipelines:\n", config.pipelines.map((p) => p.name).join("\n "));

            process.exit(1);
        }

        let job = `job-${pipeline.name}-${directoryTimestamp()}`;
        if (fs.existsSync(path.join(input))) {
            fs.mkdirSync(job, { recursive: true });

            if (fs.lstatSync(path.join(input)).isDirectory()) {
                //copy input to job directory
                for (const file of fs.readdirSync(input)) {
                    if (file.endsWith(".png")) {
                        fs.copyFileSync(path.join(input, file), path.join(job, file));
                    }
                }
            } else {
                fs.copyFileSync(path.join(input), path.join(job, path.basename(input)));
            }
        } else {
            console.error("Input not found");
            return;
        }

        console.log(chalk.bgBlue(chalk.yellowBright(` Running pipeline "${pipeline.name}" `)));

        for (const dir of config.definitions.directory ?? []) {
            fs.mkdirSync(path.join(job, dir.data), { recursive: true });
        }

        let stepIndex = 0;
        for await (const step of pipeline.steps) {
            stepIndex++;
            const tool = require(`./tools/${step.tool}`).default;
            const toolInstance = new tool() as Tool;
            console.log(chalk.yellow(`=== [${stepIndex}] ${step.tool} ===`));

            toolInstance.jobDirectory = job;
            toolInstance.setRunData(path.parse(input).name, directoryTimestamp());
            toolInstance.setDefinitions(config.definitions);
            toolInstance.setParameters(step.parameters);
            try {
                let result = await toolInstance.run();
                if (!result) {
                    break;
                }
            } catch (error) {
                console.error(error);
                break;
            }
        }

        if (!keep) fs.rmSync(job, { recursive: true, force: true });
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
