import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

type Props = {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    onChange: (name: string) => void;
    name: string;
    description: string;
};

export default function EditElement({ open, onClose, name, onChange, onDelete, description }: Props) {
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
                    onClose();
                },
            }}
        >
            <DialogTitle>{description}</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" label={description} fullWidth autoComplete="off" variant="standard" value={name} onChange={(e) => onChange(e.target.value)} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onDelete} color="error">
                    Delete
                </Button>
                <Button type="submit">Okay</Button>
            </DialogActions>
        </Dialog>
    );
}
