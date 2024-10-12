import texturePacker, { PackerType, TrimMode } from "free-tex-packer-core";
import path from "path";
import fs from "fs";
import { Tool } from "../tool";

type Parameters = {
    output: string;
    prefix: string;
    padding: number;
};

export default class PackerTool extends Tool<Parameters> {
    constructor() {
        super(__filename);
    }

    async run(): Promise<boolean> {
        const { output, prefix, padding } = this.parameters;
        const images = new Array<{ path: string; contents: Buffer }>();

        const usePrefix = this.transformString(prefix);
        const useOutput = this.transformString(output);

        for (const file of fs.readdirSync(path.join(this.jobDirectory))) {
            if (file.endsWith(".png")) {
                images.push({ path: usePrefix + path.parse(file).name, contents: fs.readFileSync(path.join(this.jobDirectory, file)) });
            }
            fs.rmSync(path.join(this.jobDirectory, file));
        }

        this.log({ packing: images.length, into: useOutput });
        const promise = new Promise<boolean>((resolve) => {
            texturePacker(
                images,
                {
                    allowTrim: false,
                    textureName:useOutput,
                    padding: Number(padding),
                },
                (files, error) => {
                    if (error) {
                        console.error("Packaging failed", error);
                    } else {
                        for (let item of files) {
                            fs.writeFileSync(path.join(this.jobDirectory,item.name), item.buffer);
                        }
                        this.log({ finished: useOutput });
                        resolve(true);
                    }
                }
            );
        });

        return promise;
    }
}
