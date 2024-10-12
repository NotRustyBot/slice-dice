import path from "path";
import fs from "fs";
import { Tool } from "../tool";
import { Jimp, intToRGBA, rgbaToInt } from "jimp";

type Parameters = {
    treshold: number;
};

export default class BlackToAlphaTool extends Tool<Parameters> {
    constructor() {
        super(__filename);
    }

    async run(): Promise<boolean> {
        const { treshold } = this.parameters;

        for await (const file of fs.readdirSync(path.join(this.jobDirectory))) {
            if (file.endsWith(".png")) {
                await blackToAlpha(path.join(this.jobDirectory, file), path.join(this.jobDirectory, file), treshold);
                this.log({ converted: file });
            }
        }

        return true;
    }
}

const blackToAlpha = async (inputPath: string, outputPath: string, treshold: number) => {
    const image = await Jimp.read(inputPath);

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const red = this.bitmap.data[idx];
        const green = this.bitmap.data[idx + 1];
        const blue = this.bitmap.data[idx + 2];

        if (red <= treshold && green <= treshold && blue <= treshold) {
            this.bitmap.data[idx + 3] = intToRGBA(0).a;
        }
    });

    if (isStringDotString(outputPath)) await image.write(outputPath);
};

function isStringDotString(obj: any): obj is `${string}.${string}` {
    return typeof obj === "string" && obj.includes(".");
}
