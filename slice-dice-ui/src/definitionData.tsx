import { BorderAll, QuestionMark } from "@mui/icons-material";
import { ReactElement } from "react";
import { loadSplits, NamedRectangle } from "./pixiMain";

const lookup: Record<string, { icon: ReactElement; defaultData: () => unknown; edit: (data: unknown) => void; info: (data: unknown) => string }> = {
    slices: {
        icon: <BorderAll />,
        defaultData: () => [],
        edit: (data: unknown) => {
            const useData = data as { id: number; data: Array<NamedRectangle> };
            loadSplits(useData.data);
        },
        info: (data: unknown) => {
            const useData = data as { id: number; data: Array<NamedRectangle> };
            return `Slices: ${useData.data.length}`;
        },
    },
};

export function getDefinitionData(name: string) {
    if (name in lookup) {
        return lookup[name];
    }
    return {
        icon: <QuestionMark />,
        defaultData: () => ({}),
        edit: () => {},
        info: () => "Unknown Definition",
    };
}

export function getKnownDefinitions() {
    return Object.keys(lookup);
}
