import { IconButton, List, ListItemButton, ListItemText, TextField } from "@mui/material";
import { setSharedData, sharedData } from "./shared";
import { Add, Delete } from "@mui/icons-material";
import Step from "./Step";
import AddStep from "./AddStep";
import { useState } from "react";

export default function PiplineEditor() {
    const [openAddStep, setOpenAddStep] = useState(false);
    if (sharedData.selectedPipeline == undefined) {
        return <></>;
    }
    return (
        <div
            style={{
                background: "#f8f8f8",
                pointerEvents: "all",
                padding: "10px",
                overflowY: "auto",
                overflowX: "hidden",
                resize: "horizontal",
                width: "300px",
                minWidth: "300px",
                flexShrink: 0,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <TextField
                    margin="dense"
                    label="Pipeline Name"
                    fullWidth
                    autoComplete="off"
                    variant="standard"
                    value={sharedData.config.pipelines[sharedData.selectedPipeline].name}
                    onChange={(e) => {
                        const copy = { ...sharedData };
                        if (sharedData.selectedPipeline == undefined) return;
                        copy.config.pipelines[sharedData.selectedPipeline].name = e.target.value;
                        setSharedData(copy);
                    }}
                />

                <IconButton
                    onClick={() => {
                        const copy = { ...sharedData };
                        if (copy.selectedPipeline == undefined) return;
                        copy.confirm = {
                            open: true,
                            text: <span>Are you sure you want to delete <code>{copy.config.pipelines[copy.selectedPipeline].name}</code>?</span>,
                            onConfirm: () => {
                                const copy = { ...sharedData };
                                if (copy.selectedPipeline == undefined) return;
                                copy.config.pipelines.splice(copy.selectedPipeline, 1);
                                copy.selectedPipeline = undefined;
                                copy.confirm.open = false;
                                setSharedData(copy);
                            },

                            onClose: () => {
                                const copy = { ...sharedData };
                                copy.confirm.open = false;
                                setSharedData(copy);
                            }
                        };
                        setSharedData(copy);
                    }}
                >
                    <Delete />
                </IconButton>
            </div>

            <List>
                {sharedData.config.pipelines[sharedData.selectedPipeline].steps.map((step, index) => (
                    <Step
                        tool={step.tool}
                        parameters={step.parameters}
                        key={index}
                        index={index}
                        swap={() => {
                            const copy = { ...sharedData };
                            if (copy.selectedPipeline == undefined) return;
                            copy.config.pipelines[copy.selectedPipeline].steps.splice(index, 1);
                            copy.config.pipelines[copy.selectedPipeline].steps.splice(index - 1, 0, step);
                            setSharedData(copy);
                        }}
                    />
                ))}
                <ListItemButton
                    onClick={() => {
                        setOpenAddStep(true);
                    }}
                >
                    <ListItemText primary="Add Step" />
                    <Add />
                </ListItemButton>
            </List>
            <AddStep open={openAddStep} onClose={() => setOpenAddStep(false)} />
        </div>
    );
}
