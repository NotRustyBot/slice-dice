"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const tool_1 = require("../tool");
const fs_1 = __importDefault(require("fs"));
class OutputDirectoryTool extends tool_1.Tool {
    constructor() {
        super(__filename);
    }
    async run() {
        const { target } = this.parameters;
        let targetName = this.transformString(target);
        if (!fs_1.default.existsSync(targetName)) {
            fs_1.default.mkdirSync(targetName, { recursive: true });
        }
        for (const file of fs_1.default.readdirSync(path_1.default.join(this.jobDirectory))) {
            fs_1.default.copyFileSync(path_1.default.join(this.jobDirectory, file), path_1.default.join(targetName, file));
            this.log({ copied: file });
        }
        return true;
    }
}
exports.default = OutputDirectoryTool;
