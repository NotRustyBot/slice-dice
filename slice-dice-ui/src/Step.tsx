import { Checkbox, Divider, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, ListItem, MenuItem, Select, TextField, Typography } from "@mui/material";
import { getToolInfo, Reqirement } from "./toolDefs";
import { setSharedData, sharedData } from "./shared";
import { getDefinitionData } from "./definitionData";
import { ArrowUpward, Delete } from "@mui/icons-material";

type Props = {
    tool: string;
    parameters: Record<string, unknown>;
    index: number;
    swap: () => void;
};

export default function Step({ tool, parameters, index, swap }: Props) {
    const requirements = getToolInfo(tool).requirements;
    return (
        <>
            <ListItem>
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h6">{tool}</Typography>
                        <div>
                            <IconButton
                                onClick={() => {
                                    const copy = { ...sharedData };
                                    if (copy.selectedPipeline == undefined) return;
                                    copy.config.pipelines[copy.selectedPipeline].steps.splice(index, 1);
                                    setSharedData(copy);
                                }}
                            >
                                <Delete />
                            </IconButton>
                            <IconButton onClick={swap} disabled={index == 0}>
                                <ArrowUpward />
                            </IconButton>
                        </div>
                    </div>
                    {requirements.map((r, i) => inputLookup[r.type](r, parameters[r.name as keyof typeof parameters] as string, i, index))}
                </div>
            </ListItem>
            <Divider />
        </>
    );
}

const inputLookup: Record<string, (requirement: Reqirement, value: string, key: number, toolIndex: number) => JSX.Element> = {
    string: (r, value, key, toolIndex) => (
        <TextField
            value={value}
            label={r.name}
            key={key}
            onChange={(e) => {
                const copy = { ...sharedData };
                if (copy.selectedPipeline == undefined) return;
                copy.config.pipelines[copy.selectedPipeline].steps[toolIndex].parameters[r.name] = e.target.value;
                setSharedData(copy);
            }}
        />
    ),
    number: (r, value, key, toolIndex) => (
        <TextField
            type="number"
            value={value}
            label={r.name}
            key={key}
            onChange={(e) => {
                const copy = { ...sharedData };
                if (copy.selectedPipeline == undefined) return;
                copy.config.pipelines[copy.selectedPipeline].steps[toolIndex].parameters[r.name] = e.target.value;
                setSharedData(copy);
            }}
        />
    ),
    boolean: (r, value, key, toolIndex) => (
        <FormGroup>
            <FormControlLabel
                control={
                    <Checkbox
                        value={value}
                        onChange={(e) => {
                            const copy = { ...sharedData };
                            if (copy.selectedPipeline == undefined) return;
                            copy.config.pipelines[copy.selectedPipeline].steps[toolIndex].parameters[r.name] = e.target.checked;
                            setSharedData(copy);
                        }}
                    />
                }
                label={r.name}
                key={key}
            />
        </FormGroup>
    ),
    definition: (r, value, key, toolIndex) => {
        if (r.type !== "definition") return <></>;
        const info = getDefinitionData(r.kind).info;
        return (
            <FormControl fullWidth key={key}>
                <InputLabel id={r.name + "-label"}>{r.name}</InputLabel>
                <Select
                    value={value}
                    labelId={r.name + "-label"}
                    label="Type"
                    onChange={(e) => {
                        const copy = { ...sharedData };

                        if (copy.selectedPipeline == undefined) return;
                        copy.config.pipelines[copy.selectedPipeline].steps[toolIndex].parameters[r.name] = e.target.value;
                        setSharedData(copy);
                    }}
                >
                    {sharedData.config.definitions[r.kind] != undefined
                        ? sharedData.config.definitions[r.kind].map((def: { id: number }) => (
                              <MenuItem key={def.id} value={def.id}>
                                  <div>
                                      <Typography>{r.kind + " " + def.id}</Typography>
                                      <Typography variant="caption">{info(def)}</Typography>
                                  </div>
                              </MenuItem>
                          ))
                        : null}
                </Select>
            </FormControl>
        );
    },
};
