import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { ReactNode } from "react";
import { getDefinitionData, getKnownDefinitions } from "./definitionData";
import { sharedData } from "./shared";

type Props = {
    open: boolean;
    onClose: () => void;
    onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void;
    type: string;
};

export default function AddDefinition({ open, onClose, type, onChange }: Props) {
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
                    if (!(type in copy.config.definitions)) {
                        copy.config.definitions[type] = [];
                    }
                    copy.config.definitions[type].push({ id: copy.config.definitions[type].reduce((a, b) => Math.max(a, b.id),-1)+1, data: getDefinitionData(type).defaultData() });
                    onClose();
                },
            }}
        >
            <DialogTitle>Add Definition</DialogTitle>
            <DialogContent>
                <InputLabel id="add-definition-label">Add Definition</InputLabel>
                <Select fullWidth labelId="add-definition-label" value={type} label="Type" onChange={onChange}>
                    {getKnownDefinitions().map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </Select>
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
