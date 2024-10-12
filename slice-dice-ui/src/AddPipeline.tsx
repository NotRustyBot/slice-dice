import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import { sharedData } from "./shared";

type Props = {
    open: boolean;
    onClose: () => void;
    onChange: (text: string) => void;
    name: string;
};

export default function AddPipeline({ open, onClose, name, onChange }: Props) {
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
                    copy.config.pipelines.push({ name, steps: [] });
                    onClose();
                },
            }}
        >
            <DialogTitle>Add Pipeline</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" label="Pipeline Name" fullWidth autoComplete="off" variant="standard" value={name} onChange={(e) => onChange(e.target.value)} />
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
