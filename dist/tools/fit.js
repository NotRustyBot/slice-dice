"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const tool_1 = require("../tool");
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
class SlicerTool extends tool_1.Tool {
    constructor() {
        super(__filename);
    }
    async run() {
        const { width, height } = this.parameters;
        for await (const file of fs_1.default.readdirSync(path_1.default.join(this.jobDirectory))) {
            if (file.endsWith(".png")) {
                const buffer = await (0, sharp_1.default)(path_1.default.join(this.jobDirectory, file)).resize(Number(width), Number(height), { fit: "inside" }).toBuffer();
                fs_1.default.writeFileSync(path_1.default.join(this.jobDirectory, file), buffer);
                this.log({ resized: file });
            }
        }
        return true;
    }
}
exports.default = SlicerTool;
