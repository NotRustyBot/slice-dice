import { Rectangle } from "../rect";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { Tool } from "../tool";

type NamedRectangle = {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
};

type Parameters = {
    slices: number;
};

export default class SlicerTool extends Tool<Parameters> {
    constructor() {
        super(__filename);
    }

    async run(): Promise<boolean> {
        const file = fs.readdirSync(this.jobDirectory).find((f) => f.endsWith(".png"));
        if (file === undefined) {
            throw new Error("No image found in job directory");
        }
        const image = fs.readFileSync(path.join(this.jobDirectory, file));
        const slices = this.getDefinition("slices", this.parameters.slices) as NamedRectangle[];

        for await (const namedRectangle of slices) {
            await sharp(image)
                .extract(new Rectangle(namedRectangle.x, namedRectangle.y, namedRectangle.width, namedRectangle.height))
                .toFile(path.join(this.jobDirectory, `${namedRectangle.name}.png`));
            this.log({ cutting: `${namedRectangle.x}:${namedRectangle.y} ${namedRectangle.width}x${namedRectangle.height}`, into: namedRectangle.name });
        }

        fs.rmSync(path.join(this.jobDirectory, file));

        return true;
    }
}
