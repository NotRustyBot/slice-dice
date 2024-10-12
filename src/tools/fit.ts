import path from "path";
import { Tool } from "../tool";
import sharp from "sharp";
import fs from "fs";

type Parameters = {
    width: number;
    height: number;
};

export default class SlicerTool extends Tool<Parameters> {
    constructor() {
        super(__filename);
    }

    async run(): Promise<boolean> {
        const { width, height } = this.parameters;

        for await (const file of fs.readdirSync(path.join(this.jobDirectory))) {
            if (file.endsWith(".png")) {
                const buffer = await sharp(path.join(this.jobDirectory, file)).resize(Number(width), Number(height), { fit: "inside" }).toBuffer();
                fs.writeFileSync(path.join(this.jobDirectory, file), buffer);
                this.log({ resized: file });
            }
        }

        return true;
    }
}
