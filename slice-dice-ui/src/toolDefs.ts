export type Reqirement =
    | {
          name: string;
          type: "string" | "number" | "boolean";
      }
    | {
          name: string;
          type: "definition";
          kind: string;
      };

const lookup: Record<string, { requirements: Array<Reqirement>; default: Record<string, unknown> }> = {
    slicer: {
        requirements: [
            {
                name: "slices",
                type: "definition",
                kind: "slices",
            },
        ],
        default: {
            slices: "",
        },
    },
    packer: {
        requirements: [
            {
                name: "output",
                type: "string",
            },
            {
                name: "prefix",
                type: "string",
            },
            {
                name: "padding",
                type: "number",
            },
        ],
        default: {
            output: "",
            prefix: "",
            padding: 0
        },
    },
    ["black-to-alpha"]: {
        requirements: [
            {
                name: "treshold",
                type: "number",
            },
        ],
        default: {
            treshold: 0,
        },
    },
    ["output-directory"]: {
        requirements: [
            {
                name: "target",
                type: "string",
            },
        ],
        default: {
            target: "",
        },
    },
    fit: {
        requirements: [
            {
                name: "width",
                type: "number",
            },
            {
                name: "height",
                type: "number",
            },
        ],
        default: {
            height: 0,
            width: 0,
        },
    },
};

export function getToolInfo(tool: string) {
    return lookup[tool];
}

export function getKnownTools() {
    return Object.keys(lookup);
}
