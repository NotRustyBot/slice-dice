"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tool = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const chalk_1 = __importDefault(require("chalk"));
class Tool {
    constructor(filename = __filename) {
        this.filename = filename;
    }
    createTempDirectory() {
        return fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), "texture-packer-" +
            Math.floor(Math.random() * 1000)
                .toString()
                .padStart(3, "0")));
    }
    transformString(str) {
        str = str.replace(/\$name/g, this.name);
        str = str.replace(/\$time/g, this.time);
        return str;
    }
    setRunData(name, time) {
        this.name = name;
        this.time = time;
    }
    setParameters(parameters) {
        this.parameters = parameters;
    }
    setDefinitions(definitions) {
        this.definitions = definitions;
    }
    getDefinition(name, id, optional = false) {
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
    error(message) {
        console.error(chalk_1.default.red(`[${path_1.default.parse(this.filename).name}] `) + message);
    }
    log(data) {
        console.log(chalk_1.default.blueBright(`[${path_1.default.parse(this.filename).name}] `.padEnd(20, " ")) +
            Object.entries(data)
                .map(([k, v]) => `${chalk_1.default.white(k)}: ${chalk_1.default.green(v)}`)
                .join(" "));
    }
}
exports.Tool = Tool;
