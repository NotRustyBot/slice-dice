import path from "path";
import { Tool } from "../tool";
import fs from "fs";

type Parameters = {
    target: string;
};

export default class OutputDirectoryTool extends Tool<Parameters> {
    constructor() {
        super(__filename);
    }

    async run(): Promise<boolean> {
        const { target } = this.parameters;
        let targetName = this.transformString(target);
        
        if(!fs.existsSync(targetName)){
            fs.mkdirSync(targetName, { recursive: true });
        }

        for (const file of fs.readdirSync(path.join(this.jobDirectory))) {
            fs.copyFileSync(path.join(this.jobDirectory, file), path.join(targetName, file));
            this.log({ copied: file });
        }

        return true;
    }
}
