"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rect_1 = require("../rect");
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const tool_1 = require("../tool");
class SlicerTool extends tool_1.Tool {
    constructor() {
        super(__filename);
    }
    async run() {
        const file = fs_1.default.readdirSync(this.jobDirectory).find((f) => f.endsWith(".png"));
        if (file === undefined) {
            throw new Error("No image found in job directory");
        }
        const image = fs_1.default.readFileSync(path_1.default.join(this.jobDirectory, file));
        const slices = this.getDefinition("slices", this.parameters.slices);
        for await (const namedRectangle of slices) {
            await (0, sharp_1.default)(image)
                .extract(new rect_1.Rectangle(namedRectangle.x, namedRectangle.y, namedRectangle.width, namedRectangle.height))
                .toFile(path_1.default.join(this.jobDirectory, `${namedRectangle.name}.png`));
            this.log({ cutting: `${namedRectangle.x}:${namedRectangle.y} ${namedRectangle.width}x${namedRectangle.height}`, into: namedRectangle.name });
        }
        fs_1.default.rmSync(path_1.default.join(this.jobDirectory, file));
        return true;
    }
}
exports.default = SlicerTool;
