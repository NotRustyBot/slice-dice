import { ReactNode } from "react";
import { Config } from "../../src/main.ts";

const config: Config = {
    definitions: {},
    pipelines: [],
};

export let sharedData = {
    rename: {
        name: "",
        onChange: (name: string) => {
            console.log(name);
        },
        onClose: () => {},
        onDelete: () => {},
        open: false,
        description: "",
    },
    gridSize: 32,
    selectNewRectangles: false,
    confirm: {
        open: false,
        text: "" as ReactNode,
        onConfirm: () => {},
        onClose: () => {},
    },
    config: config,
    selectedPipeline: undefined as undefined | number,
};
export type SharedData = typeof sharedData;

export let setSharedData: (object: SharedData) => void;

export function updateSetSharedData(updater: (object: SharedData) => void) {
    setSharedData = updater;
}

export function updateData(object: SharedData) {
    sharedData = object;
}
