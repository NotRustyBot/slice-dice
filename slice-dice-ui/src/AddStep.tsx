import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { sharedData } from "./shared";
import { useState } from "react";
import { getKnownTools, getToolInfo } from "./toolDefs";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function AddStep({ open, onClose }: Props) {
    const [type, setType] = useState("");

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={onClose}
            PaperProps={{
                component: "form",
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const copy = { ...sharedData };
                    if (copy.selectedPipeline != undefined) {
                        copy.config.pipelines[copy.selectedPipeline].steps.push({
                            tool: type,
                            parameters: { ...getToolInfo(type).default },
                        });
                    }
                    onClose();
                },
            }}
        >
            <DialogTitle>Add Step</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="add-step-label">Add Step</InputLabel>
                    <Select fullWidth labelId="add-step-label" label="Add Step" value={type} onChange={(e) => setType(e.target.value)}>
                        {getKnownTools().map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    Cancel
                </Button>
                <Button type="submit">Create</Button>
            </DialogActions>
        </Dialog>
    );
}
