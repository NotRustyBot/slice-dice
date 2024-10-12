"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const free_tex_packer_core_1 = __importDefault(require("free-tex-packer-core"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const tool_1 = require("../tool");
class PackerTool extends tool_1.Tool {
    constructor() {
        super(__filename);
    }
    async run() {
        const { output, prefix, padding } = this.parameters;
        const images = new Array();
        const usePrefix = this.transformString(prefix);
        const useOutput = this.transformString(output);
        for (const file of fs_1.default.readdirSync(path_1.default.join(this.jobDirectory))) {
            if (file.endsWith(".png")) {
                images.push({ path: usePrefix + path_1.default.parse(file).name, contents: fs_1.default.readFileSync(path_1.default.join(this.jobDirectory, file)) });
            }
            fs_1.default.rmSync(path_1.default.join(this.jobDirectory, file));
        }
        this.log({ packing: images.length, into: useOutput });
        const promise = new Promise((resolve) => {
            (0, free_tex_packer_core_1.default)(images, {
                allowTrim: false,
                textureName: useOutput,
                padding: Number(padding),
            }, (files, error) => {
                if (error) {
                    console.error("Packaging failed", error);
                }
                else {
                    for (let item of files) {
                        fs_1.default.writeFileSync(path_1.default.join(this.jobDirectory, item.name), item.buffer);
                    }
                    this.log({ finished: useOutput });
                    resolve(true);
                }
            });
        });
        return promise;
    }
}
exports.default = PackerTool;
