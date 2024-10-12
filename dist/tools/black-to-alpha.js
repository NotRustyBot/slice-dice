"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const tool_1 = require("../tool");
const jimp_1 = require("jimp");
class BlackToAlphaTool extends tool_1.Tool {
    constructor() {
        super(__filename);
    }
    async run() {
        const { treshold } = this.parameters;
        for await (const file of fs_1.default.readdirSync(path_1.default.join(this.jobDirectory))) {
            if (file.endsWith(".png")) {
                await blackToAlpha(path_1.default.join(this.jobDirectory, file), path_1.default.join(this.jobDirectory, file), treshold);
                this.log({ converted: file });
            }
        }
        return true;
    }
}
exports.default = BlackToAlphaTool;
const blackToAlpha = async (inputPath, outputPath, treshold) => {
    const image = await jimp_1.Jimp.read(inputPath);
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const red = this.bitmap.data[idx];
        const green = this.bitmap.data[idx + 1];
        const blue = this.bitmap.data[idx + 2];
        if (red <= treshold && green <= treshold && blue <= treshold) {
            this.bitmap.data[idx + 3] = (0, jimp_1.intToRGBA)(0).a;
        }
    });
    if (isStringDotString(outputPath))
        await image.write(outputPath);
};
function isStringDotString(obj) {
    return typeof obj === "string" && obj.includes(".");
}
