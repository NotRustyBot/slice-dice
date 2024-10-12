import fs from "fs";
import path from "path";
import os from "os";
import chalk from "chalk";



export abstract class Tool<T = any> {
    filename: string;
    constructor(filename = __filename) {
        this.filename = filename;
    }
    jobDirectory!: string;
    parameters!: T;
    definitions!: Record<string, any[]>;
    abstract run(): Promise<boolean>;
    createTempDirectory() {
        return fs.mkdtempSync(
            path.join(
                os.tmpdir(),
                "texture-packer-" +
                    Math.floor(Math.random() * 1000)
                        .toString()
                        .padStart(3, "0")
            )
        );
    }

    transformString(str: string) {
        str = str.replace(/\$name/g, this.name);
        str = str.replace(/\$time/g, this.time);
        return str;
    }

    name!: string;
    time!: string;
    setRunData(name: string, time: string){
        this.name = name;
        this.time = time;
    }

    setParameters(parameters: T) {
        this.parameters = parameters;
    }

    setDefinitions(definitions: Record<string, any[]>) {
        this.definitions = definitions;
    }

    getDefinition(name: string, id: number, optional = false) {
        if (!this.definitions[name]) {
            if (!optional) {
                this.error(`Definition ${name} not found`);
                process.exit(1);
            }
            return undefined;
        }

        const def = this.definitions[name].find((def) => def.id == id);

        if (!def) {
            if (!optional) {
                this.error(`Definition ${name}[${id}] not found`);
                process.exit(1);
            }
            return undefined;
        }

        return def.data;
    }

    error(message: string) {
        console.error(chalk.red(`[${path.parse(this.filename).name}] `) + message);
    }

    log(data: Record<string, any>) {
        console.log(
            chalk.blueBright(`[${path.parse(this.filename).name}] `.padEnd(20, " ")) +
                Object.entries(data)
                    .map(([k, v]) => `${chalk.white(k)}: ${chalk.green(v)}`)
                    .join(" ")
        );
    }

}
